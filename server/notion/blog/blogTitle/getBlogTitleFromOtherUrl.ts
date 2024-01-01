import axios from 'axios';
import * as cheerio from 'cheerio';
import { removeNotTitle } from './removeNotBlogTitle';

export async function getBlogTitleFromUrl(url: string, notionTitle: string) {
    try{
        const {data} = await axios.get(url);
        const $ = cheerio.load(data);
        const blogAllTitle = $('title').text();

        const blogTitle = removeNotTitle(url, blogAllTitle, notionTitle);
        return blogTitle;

    } catch(error) {
        console.log('url의 제목을 가져오지 못했습니다!');
    }

}