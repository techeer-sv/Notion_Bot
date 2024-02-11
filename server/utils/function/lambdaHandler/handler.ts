import { AwsCallback, AwsEvent, AwsResponse } from "@slack/bolt/dist/receivers/AwsLambdaReceiver";
import { awsLambdaReceiver } from "../../appModule/lambdaReciver/awsLambdaReceiver";
import { submitNotionCommandHandler } from "../../../notion/blog/handler/submitNotionCommandHandler";
import { uploadNotionBlogViewHandler } from "../../../notion/blog/handler/uploadNotionBlogViewHandler";
import { app } from "../../appModule/slack/slack";
import { notion } from "../../appModule/notion/notion";
import { CustomAwsEvent } from "../../../types/AwsEvent";

let handlerRegistered = false;

export const handler = async(
    event: CustomAwsEvent,
    context: any,
    callback: AwsCallback
): Promise<AwsResponse> => {
    if(event.source === 'aws.events'){
        console.log('Warm Start 설정');
        return {statusCode:200, body:'Warm Start 완료'};
    }

    if(!handlerRegistered){
        submitNotionCommandHandler(app);
        uploadNotionBlogViewHandler(app, notion);
        handlerRegistered = true;
        console.log('lambda에 handler 등록');
    }
    const slackHandler = await awsLambdaReceiver.start();
    console.log('awsLambdaReceiver 실행');
    return slackHandler(event, context, callback);
}