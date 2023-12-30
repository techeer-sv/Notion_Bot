import { scheduleJob, RecurrenceRule } from 'node-schedule';
import { convertUTCToKST } from "../utils/function/convertDate/convertUtcToKst";
import { notion } from '../utils/appModule/notion/notion';
import { sendSlackMessage } from '../utils/function/slack/sendToChannel';
import { getBlogTitleFromUrl } from '../notion/blog/blogTitle/getBlogTitleFromOtherUrl';

const rule = new RecurrenceRule(); // 주기 바꾸기
rule.minute = [0, 5, 7, 11, 20, 27, 30, 33, 36, 49, 54, 55];
// rule.dayOfWeek = 1
// rule.hour = 9;
// rule.minute = 0;
// rule.tz = 'Asia/Seoul';


export function SendBlogInfoToSlackSchedule(){
    scheduleJob(rule, async function() {
        console.log('매주 월요일 오전 9시에 실행');
        try {
            const filterDate = new Date();
            filterDate.setHours(filterDate.getHours() - 168); // 일주일로 설정
            const filterDateKst = convertUTCToKST(filterDate);
    
            const databaseId = process.env.NOTION_DATABASE_ID;
            if(!databaseId){
                throw new Error('노션DB ID가 제대로 연결되지 않았습니다');
            }
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
            const slakChannelId = process.env.TEST_CHANNEL; // 채널 어디다 보낼지
            if (typeof slakChannelId !== 'string') {
                throw new Error('slakChannelId가 제대로 설정되지 않았습니다!');
            }
            sendSlackMessage(slakChannelId, combineBlogInfo);
    
    
        } catch (error) {
            console.error('노션 데이터베이스 컬럼을 제대로 가져오지 못했습니다:', error);
        }
    });
}