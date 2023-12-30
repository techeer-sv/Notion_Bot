import dotenv from 'dotenv';
dotenv.config();
import { App } from '@slack/bolt';
import { Client } from '@notionhq/client';
import {submitNotionCommandHandler} from './server/notion/blog/submitNotionCommandHandler';
import {uploadNotionBlogViewHandler} from './server/notion/blog/uploadNotionBlogViewHandler';
import { slackBotMentionHandler } from './server/slack/mention/slackBotMentionHandler';
import { scheduleJob, RecurrenceRule } from 'node-schedule';
import * as cheerio from 'cheerio';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import axios from 'axios';
import { error } from 'console';


const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN, 
    socketMode: true,
});

const notion = new Client({ auth: process.env.NOTION_TOKEN });
slackBotMentionHandler(app);
submitNotionCommandHandler(app);
uploadNotionBlogViewHandler(app);

const slackClient = new Client({ auth: process.env.SLACK_BOT_TOKEN });


async function getBlogTitleFromUrl(url: string, notionTitle: string) {
    try{
        const {data} = await axios.get(url);
        const $ = cheerio.load(data);
        const blogAllTitle = $('title').text();

        const blogTitle = removeNotTitle(url, blogAllTitle, notionTitle);
        return blogTitle;

    } catch(error) {
        console.log('url의 제목을 가져오지 못했습니다!');
    }

}

async function getBlogTitleFromGitHubIo(url: string) {
    try{
        const {data} = await axios.get(url);
        const $ = cheerio.load(data);
        const gitHubIoTitle = $('h1').text();
    
        return gitHubIoTitle.trim();
    } catch(error) {
        console.log('GitHubIo url의 제목을 가져오지 못했습니다!');
    }
}



function removeNotTitle(url: string, title: string, notionTitle: string) {
    try{
        if(url.includes('medium.com')){
            const cutTitle = title.split('| by');
            return cutTitle[0].trim();
        } else if(url.includes('github.io')){
            return getBlogTitleFromGitHubIo(url);
        } else if(url.includes('notion.site')){
            return notionTitle;
        } else{
            return title;
        }

    } catch(error) {
        console.log('블로그 제목 이외의 값을 지우지 못했습니다!');
    }
}

async function sendBlogInfoSlackMessage(channel: string, text: string) {
    try{
       const response = await app.client.chat.postMessage({
        channel: channel,
        text: text
       })
    } catch(error) {
        console.log('슬랙에 블로그를 전달하지 못했습니다.');
    }
}

function convertUTCToKST(utcDate: Date){
    try{
        if(!utcDate || isNaN(utcDate.getTime())){
            throw new Error('잘못된 날짜 형식입니다.');
        }
        const convertKst = 60 * 9;
        return new Date(utcDate.getTime() + convertKst * 60000);
    } catch(error) {
        console.log('kst로 시간 변환을 하지 못했습니다.');
        return undefined;
    }
}

interface NotionDataArr {
    notionTitle: string;
    url: string;
    creator: string;
    blogTitle?: string;
}

const rule = new RecurrenceRule(); // 주기 바꾸기
// rule.minute = [0, 5, 7, 11, 20, 27, 30, 33, 36, 49, 54, 55];
rule.dayOfWeek = 6
rule.hour = 19;
rule.minute = 0;
rule.tz = 'Asia/Seoul';



// 서버 연결
(async () => {
    await app.start();
    // console.log('돌아간다서버가');
})();

//노션 api 연결
(async () => {
    try {
        const listUsersResponse = await notion.users.list({});
        // console.log(listUsersResponse);
    } catch (error) {
        console.error('Error: ', error);
    }
})();

//노션 database 연결
(async () => {
    try {
        if (typeof process.env.NOTION_DATABASE_ID !== 'string') {
            throw new Error('The NOTION_DATABASE_ID 환경 변수 설정 문제');
        }
        
        const databaseId = process.env.NOTION_DATABASE_ID;

        scheduleJob(rule, async function() {
            console.log('스케줄러 실행: 매주 토요일 오후 7시에 실행');
            try {
                const filterDate = new Date();
                filterDate.setHours(filterDate.getHours() - 168); // 일주일로 설정
                const filterDateKst = convertUTCToKST(filterDate);

                const response = await notion.databases.query({
                    database_id: databaseId
                });

                let notionData = [];
                for (const notionInfo of response.results) {
                    const page = notionInfo as any;
                    if (page.properties) {
                        const properties = page.properties;
                        const notionTitle = properties['제목']?.title[0]?.plain_text || "";
                        const url = properties['URL']?.url;
                        const creator = properties['작성자']?.rich_text[0]?.plain_text || "";
                        const blogTitle = await getBlogTitleFromUrl(url, notionTitle);
                        const submitBlogDateKST = convertUTCToKST(new Date(page.created_time));
                        
                        if(submitBlogDateKST && filterDateKst && submitBlogDateKST > filterDateKst){
                            notionData.push({notionTitle, url, creator, blogTitle});
                        }
                    }
                }
                let currentDate = convertUTCToKST(new Date());
                if(!currentDate){
                    throw new Error('한국 날짜로 변경되지 않았습니다!');
                }
                let yesterday = new Date(currentDate);
                yesterday.setDate(yesterday.getDate()-1);

                let lastWeek = new Date(currentDate);
                lastWeek.setDate(lastWeek.getDate()-7);

                let formatYesterdayToKoreaVersion = yesterday?.toLocaleDateString('ko-KR',{
                    year:'numeric',
                    month:'long',
                    day: 'numeric'
                });

                let formatLastWeekToKoreaVersion = lastWeek?.toLocaleDateString('ko-KR',{
                    year:'numeric',
                    month:'long',
                    day: 'numeric'
                });

                let combineBlogInfo: string = `*[${formatLastWeekToKoreaVersion} ~ ${formatYesterdayToKoreaVersion} 테크 블로깅 챌린지 요약]* \n \n`;
                notionData.forEach((data) => {
                    const removeAngle = data.blogTitle?.replace(/[<>]/g, '') || 'No Title';
                    combineBlogInfo += `• <${data.url}|${removeAngle}> - ${data.creator}  \n`;
                });
                const slakChannelId = process.env.DEBUG_CHANNEL; // 채널 어디다 보낼지
                if (typeof slakChannelId !== 'string') {
                    throw new Error('slakChannelId가 제대로 설정되지 않았습니다!');
                }
                sendBlogInfoSlackMessage(slakChannelId, combineBlogInfo);


            } catch (error) {
                console.error('노션 데이터베이스 컬럼을 제대로 가져오지 못했습니다:', error);
            }
        });

    } catch (error) {
        console.error('노션 database 연결 실패:', error);
    }
})();