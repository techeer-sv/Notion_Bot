import { AwsCallback, AwsEvent, AwsResponse } from "@slack/bolt/dist/receivers/AwsLambdaReceiver";
import { awsLambdaReceiver } from "../../appModule/lambdaReciver/awsLambdaReceiver";
import { submitNotionCommandHandler } from "../../../notion/blog/handler/submitNotionCommandHandler";
import { uploadNotionBlogViewHandler } from "../../../notion/blog/handler/uploadNotionBlogViewHandler";
import { app } from "../../appModule/slack/slack";

export const handler = async(
    event: AwsEvent,
    context: any,
    callback: AwsCallback
): Promise<AwsResponse> => {
    submitNotionCommandHandler(app);
    uploadNotionBlogViewHandler(app);
    const slackHandler = await awsLambdaReceiver.start();
    console.log('awsLambdaReceiver 실행');
    return slackHandler(event, context, callback);
}