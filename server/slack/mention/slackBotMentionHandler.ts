import { App } from '@slack/bolt';

export const slackBotMentionHandler = (app: App) => {
    app.event('app_mention', async ({ event, say }) => {
        try {
            await say("안녕~");
        } catch (error) {
            console.error('이벤트 처리 중 오류 발생:', error);
        }
    });
}
