# 🌠 슬랙봇 기반 블로그 자동화 도구
- 블로그 URL과 제목을 입력하면 Notion 데이터베이스에 자동 업로드
- 매주 전주의 게시물을 슬랙 채널에 자동으로 공유

<br/>

# 🖨️ 개발블로그
[개발과정] 
* https://medium.com/@mira20932/귀찮은-작업들-슬랙봇으로-자동화하기-f3cdf9377ebd

[개발 중 직면했던 트러블슈팅]
* https://velog.io/@ppinkypeach/Serverless-프레임워크-사용-시-Runtime.-ImportModuleError-해결
* https://velog.io/@ppinkypeach/SlackBot-개발-Aws-Lambda-CloudWatch-Error-No-request-handler-matched-the-request-undefined-해결
* https://velog.io/@ppinkypeach/bolt-app-ReceiverMultipleAckError-해결
<br/>

# 📑 Feature[1] : 블로그 등록
등록된 채널에서 SlackBot의 [제출] 명령어로 제목과 블로그 URL을 입력하면 테크 블로깅 챌린지의 Notion 데이터베이스에 자동으로 등록됩니다

![슬랙봇 노션 업로드](https://github.com/techeer-sv/Notion_Bot/assets/102022609/3b6e1a44-f077-4039-a127-905b04a6430b)

<br/>

# 🖨️ Feature[2] : 블로그 공유
  <span>매주 월요일 오전 9시마다 전주에 등록된 Notion 데이터베이스의 블로그들을 해당 채널에 자동으로 업로드합니다</span>

  
  <img width="530" alt="스크린샷 2024-01-03 오후 7 52 55" src="https://github.com/techeer-sv/Notion_Bot/assets/102022609/9e532dfb-7490-4c2b-b120-a1d2f6dff8ea">

  <br/>

# 🏠 시스템 아키텍처
<img width="895" alt="스크린샷 2024-02-02 오후 9 33 12" src="https://github.com/techeer-sv/Notion_Bot/assets/102022609/9d863e49-8d80-462d-b191-2de4466ba8d2">


<br/>


# 👩🏻‍💻 개발인원 : 2명
| Name    | 최현정   |  곽소정   |
| ------- | -------| ---------|
| Profile | <img width="280" alt="스크린샷 2024-01-08 오후 9 10 10" src="https://github.com/techeer-sv/Notion_Bot/assets/102022609/bc1ee107-154a-4adf-8ccc-38c83f1cce4a"> | <img width="280" alt="스크린샷 2024-01-08 오후 9 06 38" src="https://github.com/techeer-sv/Notion_Bot/assets/102022609/5734017b-9441-48c4-827b-b0a80166383b">|
| Role    | Backend | Backend  |
| gitHub  | [ppinkypeach](https://github.com/ppinkypeach) | [ssojungg](https://github.com/ssojungg)   |

