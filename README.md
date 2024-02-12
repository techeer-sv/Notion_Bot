# 🗣️ About: 슬랙봇 기반 블로그 자동화 도구

이 슬랙봇은 **200명 가량** 개발 커뮤니티의 [테크 블로깅 챌린지]를 관리하기 위해 만들어졌습니다. 2주마다 작성한 기술 블로그를 매번 공용 Notion Database에 업로드를 하는 것과 누가 어떤 글을 올렸는 지 매주 확인해야 하는 **번거로움을 해결**할 수 있습니다.

<br/>

# 🌠  기능

- 블로그 URL 입력 시 Notion 데이터베이스에 자동 업로드
- 매주 전주에 올렸던 블로그들을 테크 블로깅 채널에 공유

<br/>

# 🖨️ 개발블로그

- **슬랙봇 개발**
    - **슬랙봇 개발 과정:** [https://medium.com/@mira20932/귀찮은-작업들-슬랙봇으로-자동화하기-f3cdf9377ebd](https://medium.com/@mira20932/%EA%B7%80%EC%B0%AE%EC%9D%80-%EC%9E%91%EC%97%85%EB%93%A4-%EC%8A%AC%EB%9E%99%EB%B4%87%EC%9C%BC%EB%A1%9C-%EC%9E%90%EB%8F%99%ED%99%94%ED%95%98%EA%B8%B0-f3cdf9377ebd)
    - **Serverless로 배포한 이유 및 과정:**
    
- **트러블슈팅**
    - **Serverless 프레임워크 사용 시 Handler Path 에러:** [https://velog.io/@ppinkypeach/Serverless-프레임워크-사용-시-Runtime.-ImportModuleError-해결](https://velog.io/@ppinkypeach/Serverless-%ED%94%84%EB%A0%88%EC%9E%84%EC%9B%8C%ED%81%AC-%EC%82%AC%EC%9A%A9-%EC%8B%9C-Runtime.-ImportModuleError-%ED%95%B4%EA%B2%B0)
    - **AWS Lambda 초기화 순서 문제:** [https://velog.io/@ppinkypeach/SlackBot-개발-Aws-Lambda-CloudWatch-Error-No-request-handler-matched-the-request-undefined-해결](https://velog.io/@ppinkypeach/SlackBot-%EA%B0%9C%EB%B0%9C-Aws-Lambda-CloudWatch-Error-No-request-handler-matched-the-request-undefined-%ED%95%B4%EA%B2%B0)
    - **AWS Lambda 중복 초기화 문제:** [https://velog.io/@ppinkypeach/bolt-app-ReceiverMultipleAckError-해결](https://velog.io/@ppinkypeach/bolt-app-ReceiverMultipleAckError-%ED%95%B4%EA%B2%B0)
    - **AWS Lambda Cold Start 문제 해결 및 성능 개선:** https://velog.io/@ppinkypeach/Slackbot-개발-Lambda-성능-개선기-Cold-Start-문제
 
<br/>


# 📑 Feature[1] : 블로그 등록
테크 블로깅 채널에서 SlackBot의 [제출] 명령어로 제목과 블로그 URL을 입력하면 테크 블로깅 챌린지의 Notion 데이터베이스에 자동으로 등록됩니다

![슬랙봇 노션 업로드](https://github.com/techeer-sv/Notion_Bot/assets/102022609/3b6e1a44-f077-4039-a127-905b04a6430b)

<br/>

# 🖨️ Feature[2] : 블로그 공유
  <span>매주 월요일 오전 9시마다 전주에 등록된 Notion 데이터베이스의 블로그들을 해당 채널에 자동으로 업로드합니다</span>

  
  <img width="530" alt="스크린샷 2024-01-03 오후 7 52 55" src="https://github.com/techeer-sv/Notion_Bot/assets/102022609/9e532dfb-7490-4c2b-b120-a1d2f6dff8ea">

  <br/>



<br/>


# 👩🏻‍💻 개발인원 : 2명
| Name    | 최현정   |  곽소정   |
| ------- | -------| ---------|
| Profile | <img width="280" alt="스크린샷 2024-01-08 오후 9 10 10" src="https://github.com/techeer-sv/Notion_Bot/assets/102022609/bc1ee107-154a-4adf-8ccc-38c83f1cce4a"> | <img width="280" alt="스크린샷 2024-01-08 오후 9 06 38" src="https://github.com/techeer-sv/Notion_Bot/assets/102022609/5734017b-9441-48c4-827b-b0a80166383b">|
| Role    | Backend | Backend  |
| gitHub  | [ppinkypeach](https://github.com/ppinkypeach) | [ssojungg](https://github.com/ssojungg)   |

