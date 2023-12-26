import { Client } from '@notionhq/client';

export async function uploadBlogToNotion(blogName: string, blogUrl: string, userName: string){
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
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