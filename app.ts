import dotenv from 'dotenv';
dotenv.config();
import { App } from '@slack/bolt';
import { Client } from '@notionhq/client';
import {submitNotionCommandHandler} from './server/notion/blog/submitNotionCommandHandler';
import {uploadNotionBlogViewHandler} from './server/notion/blog/uploadNotionBlogViewHandler';
import { slackBotMentionHandler } from './server/slack/mention/slackBotMentionHandler';
import { scheduleJob } from 'node-schedule';
import * as cheerio from 'cheerio';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import axios from 'axios';

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
    const {data} = await axios.get(url);
    const $ = cheerio.load(data);
    const gitHubIoTitle = $('h1').text();

    return gitHubIoTitle.trim();
}



function removeNotTitle(url: string, title: string, notionTitle: string) {
    try{
        if(url.includes('medium.com')){
            const cutTitle = title.split('| by');
            return cutTitle[0].trim();
        } else if(url.includes('github.io')){
            return getBlogTitleFromGitHubIo(url);
        } else {
            return title;
        }


    } catch(error) {
        console.log('블로그 제목 이외의 값을 지우지 못했습니다!');
    }
}






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

// 노션 database 연결
(async () => {
    try {
        if (typeof process.env.NOTION_DATABASE_ID !== 'string') {
            throw new Error('The NOTION_DATABASE_ID 환경 변수 설정 문제');
        }
        
        const databaseId = process.env.NOTION_DATABASE_ID

        const databaseResponse = await notion.databases.retrieve({ database_id: databaseId });

        const response = await notion.databases.query({
            database_id: databaseId
        })

        for(const notionInfo of response.results){
            const page = notionInfo as any;
            if(page.properties){
                const properties = page.properties;
        
                const notionTitle = properties['제목']?.title[0]?.plain_text || "";
                const url = properties['URL']?.url;
                const creator = properties['작성자']?.rich_text[0]?.plain_text || "";
                const title = await getBlogTitleFromUrl(url, notionTitle);
        
                // scheduleJob('*/30 * * * * *', function() {
                //     console.log(`노션제목: ${title} || URL: ${url} || 작성자: ${creator}`);
                // });
                console.log(`노션제목: ${notionTitle} || URL: ${url} || 작성자: ${creator} || 블로그제목: ${title}`);
            }
        };

        // console.log(response.results);

        // console.log('노션 database:', databaseResponse);
    } catch (error) {
        console.error('노션 database 연결 실패:', error);
    }
})();
