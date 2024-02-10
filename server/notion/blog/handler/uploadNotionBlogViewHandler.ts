import { App } from '@slack/bolt';
import { Client } from '@notionhq/client';
import { handlerBlogUploadSubmission } from '../notionPage/handleBlogUploadSubmission';

export const uploadNotionBlogViewHandler = (app: App, notion: Client) => {
    app.view('uploadBlog', async({ack, body, view, client}) => {

        await ack();

        handlerBlogUploadSubmission(body, view, client);
    });
}