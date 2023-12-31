import dotenv from 'dotenv';
dotenv.config();
import {submitNotionCommandHandler} from './server/notion/blog/handler/submitNotionCommandHandler';
import {uploadNotionBlogViewHandler} from './server/notion/blog/handler/uploadNotionBlogViewHandler';
import { slackBotMentionHandler } from './server/slack/mention/handler/slackBotMentionHandler';
import { app } from './server/utils/appModule/slack/slack';
import { notion } from './server/utils/appModule/notion/notion';
import { SendBlogInfoToSlackSchedule } from './server/scheduler/sendBlogInfoToSlackChannel';


slackBotMentionHandler(app);
submitNotionCommandHandler(app);
uploadNotionBlogViewHandler(app);


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
        SendBlogInfoToSlackSchedule();
    } catch (error) {
        console.error('노션 database 연결 실패:', error);
    }
})();