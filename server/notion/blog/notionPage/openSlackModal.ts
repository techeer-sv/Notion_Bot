import { SlashCommand } from "@slack/bolt";

export async function openSlackModal(body:SlashCommand, client: any) {

    const techBlogChannelId = [process.env.TEAM_JOON_CHANNEL, process.env.DEBUG_CHANNEL];
    const currentChannelId = body.channel_id;

    if(!techBlogChannelId.includes(currentChannelId)){
        try{
            await client.chat.postMessage({
                channel: body.user_id,
                text: '해당 명령어는 테크 블로깅 챌린지 채널에서만 사용할 수 있습니다😗'
            });
        } catch (error) {
            console.error('다른 채널에서 slash command 실행시 에러메세지 에러:', error);
        }
    }else{
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
            console.error('슬랙 창 열기 실패:', error);
        }
    }   
}