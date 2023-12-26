import { App } from '@slack/bolt';
import {uploadBlogToNotion} from '../../utils/notionUtils';

export const uploadNotionBlogViewHandler = (app: App) => {
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
}