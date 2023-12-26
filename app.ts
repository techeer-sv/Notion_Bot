import dotenv from 'dotenv';
dotenv.config();
import { App } from '@slack/bolt';
import { Client } from '@notionhq/client';
import {submitNotionCommandHandler} from './server/notion/blog/submitNotionCommandHandler';
import {uploadNotionBlogViewHandler} from './server/notion/blog/uploadNotionBlogViewHandler';
import { slackBotMentionHandler } from './server/slack/mention/slackBotMentionHandler';

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


// 서버 연결
(async () => {
    await app.start();
    console.log('돌아간다서버가');
})();

//노션 api 연결
(async () => {
    try {
        const listUsersResponse = await notion.users.list({});
        console.log(listUsersResponse);
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
        
        const databaseId = process.env.NOTION_DATABASE_ID;

        const databaseResponse = await notion.databases.retrieve({ database_id: databaseId });

        console.log('노션 database:', databaseResponse);
    } catch (error) {
        console.error('노션 database 연결 실패:', error);
    }
})();
  
