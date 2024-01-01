import { getBlogTitleFromGitHubIo } from "./getBlogTitleFromGitioUrl";

export function removeNotTitle(url: string, title: string, notionTitle: string) {
    try{
        if(url.includes('medium.com')){
            const cutTitle = title.split('| by');
            return cutTitle[0].trim();
        } else if(url.includes('github.io')){
            return getBlogTitleFromGitHubIo(url);
        } else if(url.includes('notion.site')){
            return notionTitle;
        } else{
            return title;
        }

    } catch(error) {
        console.log('블로그 제목 이외의 값을 지우지 못했습니다!');
    }
}