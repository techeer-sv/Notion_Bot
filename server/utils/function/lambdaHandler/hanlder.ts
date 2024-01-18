import { AwsCallback, AwsEvent, AwsResponse } from "@slack/bolt/dist/receivers/AwsLambdaReceiver";
import { awsLambdaReceiver } from "../../appModule/lambdaReciver/awsLambdaReceiver";

export const handler = async(
    event: AwsEvent,
    context: any,
    callback: AwsCallback
): Promise<AwsResponse> => {
    const slackHandler = await awsLambdaReceiver.start();
    return slackHandler(event, context, callback);
}