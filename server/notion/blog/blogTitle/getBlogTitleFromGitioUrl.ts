import axios from 'axios';
import * as cheerio from 'cheerio';

export async function getBlogTitleFromGitHubIo(url: string) {
    try{
        const {data} = await axios.get(url);
        const $ = cheerio.load(data);
        const gitHubIoTitle = $('h1').text();
    
        return gitHubIoTitle.trim();
    } catch(error) {
        console.log('GitHubIo url의 제목을 가져오지 못했습니다!');
    }
}
