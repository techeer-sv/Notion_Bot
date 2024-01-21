import {submitNotionCommandHandler} from './server/notion/blog/handler/submitNotionCommandHandler';
import {uploadNotionBlogViewHandler} from './server/notion/blog/handler/uploadNotionBlogViewHandler';
import { app } from './server/utils/appModule/slack/slack';

submitNotionCommandHandler(app);
uploadNotionBlogViewHandler(app);