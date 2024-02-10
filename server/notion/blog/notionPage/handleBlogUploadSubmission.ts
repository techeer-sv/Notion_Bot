import { SlackViewAction, ViewOutput } from "@slack/bolt";
import { uploadBlogToNotion } from "./uploadBlogToNotion";
import { WebClient } from "@slack/web-api";
export async function handlerBlogUploadSubmission(body: SlackViewAction, view: ViewOutput, client: any){
    const userId = body.user.id;
    const slackUserInfo = await client.users.info({user: userId});
    const slackUserName = slackUserInfo.user?.profile?.real_name ?? "";
    console.log(slackUserName);

    const notionUplodeValue = view.state.values;
    const blogName = notionUplodeValue['blog_name_block']['blog_name_action'].value?? "";
    const blogUrl = notionUplodeValue['blog_link_block']['blog_link_action'].value?? "";

    try {
        const uploadNotionUrl = await uploadBlogToNotion(blogName, blogUrl, slackUserName);
        const channel = body.user.id;
        const message = `블로그가 Notion에 업로드 되었습니다! ${uploadNotionUrl.notionUrl}`;

        await client.chat.postMessage({
            channel: channel,
            text: message
        });
    } catch (error) {
        console.error('Notion 업로드 실패:', error);
    }
}