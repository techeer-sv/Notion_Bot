import { notion } from '../../../utils/appModule/notion/notion';

export async function uploadBlogToNotion(blogName: string, blogUrl: string, userName: string){
    const databaseId = process.env.NOTION_DATABASE_ID;

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

    try {
        const response = await notion.pages.create(pageCreateRequest);
        const notionPageUrl = `https://www.notion.so/${response.id.replace(/-/g, '')}`;
        return { notionUrl: notionPageUrl };
    } catch (error) {
        console.error('Notion API 호출 중 오류 발생:', error);
        throw error;
    }
}