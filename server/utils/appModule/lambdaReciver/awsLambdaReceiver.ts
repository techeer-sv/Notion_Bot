import { AwsLambdaReceiver} from '@slack/bolt';

export const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET as string,
  });