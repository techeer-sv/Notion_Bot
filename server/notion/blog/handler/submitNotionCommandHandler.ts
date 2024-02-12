import { App } from '@slack/bolt';
import { openSlackModal } from '../notionPage/openSlackModal';

export const submitNotionCommandHandler = (app: App) => {
    app.command('/제출', async ({ ack, body, client }) => {
        await ack();
        openSlackModal(body, client);


      });
}