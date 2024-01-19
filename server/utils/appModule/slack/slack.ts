import { App } from '@slack/bolt';
import { awsLambdaReceiver } from '../lambdaReciver/awsLambdaReceiver';

export const app = new App({
    token: process.env.SLACK_BOT_TOKEN as string,
    receiver: awsLambdaReceiver,
});