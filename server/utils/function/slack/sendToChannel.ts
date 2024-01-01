import {app} from '../../appModule/slack/slack';

export async function sendSlackMessage(channel: string, text: string) {
    try{
       const response = await app.client.chat.postMessage({
        channel: channel,
        text: text
       })
    } catch(error) {
        console.log('슬랙에 메세지를 전달하지 못했습니다.');
    }
}