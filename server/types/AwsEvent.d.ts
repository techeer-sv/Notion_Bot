import { AwsEvent, AwsCallback, AwsResponse } from "@slack/bolt/dist/receivers/AwsLambdaReceiver";

interface CustomAwsEvent extends AwsEvent {
    source?: string;
}