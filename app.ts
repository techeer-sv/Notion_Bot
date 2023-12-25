import dotenv from 'dotenv';
dotenv.config();

import { App } from '@slack/bolt';
import { Client } from '@notionhq/client';


const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN, 
    socketMode: true,
});

const notion = new Client({ auth: process.env.NOTION_TOKEN });


app.event('app_mention', async ({ event, say }) => {
    try {
        await say("안녕~");
    } catch (error) {
        console.error('이벤트 처리 중 오류 발생:', error);
    }
});


app.command('/제출', async ({ ack, body, client }) => {

  await ack();

  try {
      await client.views.open({
          trigger_id: body.trigger_id,
          view: {
              type: 'modal',
              callback_id: 'uploadBlog',
              title: {
                  type: 'plain_text',
                  text: '[테크 블로깅 챌린지] 블로그 등록 '
              },
              blocks: [
                  {
                      type: 'input',
                      block_id: 'blog_name_block', 
                      element: {
                          type: 'plain_text_input',
                          action_id: 'blog_name_action', 
                      },
                      label: {
                          type: 'plain_text',
                          text: '블로그 이름',
                      }
                  },
                  {
                      type: 'input',
                      block_id: 'blog_link_block', 
                      element: {
                          type: 'plain_text_input',
                          action_id: 'blog_link_action', 
                      },
                      label: {
                          type: 'plain_text',
                          text: '블로그 URL',
                      }
                  },
              ],
              submit: {
                  type: 'plain_text',
                  text: '제출'
              }
          }
      });
  } catch (error) {
      console.error('모달 열기 실패:', error);
  }
});


app.view('uploadBlog', async({ack, body, view, client}) => {

    await ack();

    const userId = body.user.id;
    const slackUserInfo = await client.users.info({user: userId});
    const slackUserName = slackUserInfo.user?.profile?.real_name ?? "";
    console.log(slackUserName);

    const notionUplodeValue = view.state.values;
    const blogName = notionUplodeValue['blog_name_block']['blog_name_action'].value?? "";
    const blogUrl = notionUplodeValue['blog_link_block']['blog_link_action'].value?? "";
    
    try {
        const uploadNotionUrl = await uploadBlogToNotion(blogName, blogUrl, slackUserName);
    
        await client.chat.postMessage({
            channel: body.user.id,
            text: `블로그가 Notion에 업로드 되었습니다! ${uploadNotionUrl.notionUrl}` ,
            response_type: 'ephemeral'
        });
    } catch (error) {
        console.error('Notion 업로드 실패:', error);
    }
});


async function uploadBlogToNotion(blogName: string, blogUrl: string, userName: string){
    console.log('databasedId 연결할게여');
    const databaseId = process.env.NOTION_DATABASE_ID;
    console.log('databasedId 연결했어요');
    console.log('Database ID:', databaseId);

    if (!databaseId) {
        console.error('databasedId 에러났어요');
        throw new Error("NOTION_DATABASE_ID가 제대로 설정되지 않음");
    }

    const pageCreateRequest = {
        parent: { database_id: databaseId },
        properties: {
            '제목': {
                title: [
                    {
                        text: { content: blogName }
                    }
                ]
            },
            'URL': {
                url: blogUrl
            },
            '작성자': {
                rich_text: [
                    {
                        text: {content: userName}
                    }
                ]
            },
        }
    };

    console.log('Notion API 요청:', JSON.stringify(pageCreateRequest, null, 3));

    try {
        const response = await notion.pages.create(pageCreateRequest);
        console.log('Page created with ID:', response.id);
        const notionPageUrl = `https://www.notion.so/${response.id.replace(/-/g, '')}`;
        console.log('Page URL:', notionPageUrl);
        return { notionUrl: notionPageUrl };
    } catch (error) {
        console.error('Notion API 호출 중 오류 발생:', error);
        throw error;
    }
}


(async () => {
    await app.start();
    console.log('돌아간다서버가');
})();



// import dotenv from 'dotenv';
// dotenv.config();

// import { Client } from '@notionhq/client';

// const notion = new Client({ auth: process.env.NOTION_TOKEN });

// // (async () => {
// //     try {
// //         const listUsersResponse = await notion.users.list({});
// //         console.log(listUsersResponse);
// //     } catch (error) {
// //         console.error('Error: ', error);
// //     }
// // })();

// (async () => {
//     try {
//         if (typeof process.env.NOTION_DATABASE_ID !== 'string') {
//             throw new Error('The NOTION_DATABASE_ID environment variable is not set.');
//         }
        
//         const databaseId = process.env.NOTION_DATABASE_ID;

//         const databaseResponse = await notion.databases.retrieve({ database_id: databaseId });

//         console.log('Database information:', databaseResponse);
//     } catch (error) {
//         console.error('Error retrieving database:', error);
//     }
// })();
  
