## Leafyer 채팅 서버

## 요약

> 2023.07.17 ~ (진행중)
>
> node.js + express + mongoDB + Soket.io

## 기술 스택

1. 언어

- JavaScript : 메인 언어
- Typescript : 런타임 타입 체크를 위해 사용

2. 서버

- node.js : 백엔드 서버를 Javascript로 구현하기 위해 사용
- express : node.js 서버 구축을 위한 프레임워크로 사용
- express-validaton : http 통신에서 vaildation 체크를 위해 사용
- soket.io : 소켓 서버를 위한 라이브러리로 사용
- cors : cors 이슈에 대해 허용하기 위해 사용

3. 자동화 실행

- nodemon : node.js 서버 자동화 설정을 위해 사용

4. DB & 스키마

- mongoDB : node.js 서버 데이터베이스를 위해 사용 (MongoDB Atlas)
- mongoose : node.js 에서 NoSQL을 사용하기 위한 ODM 라이브러리

5. 최적화

- glob : 최적화 코드 작성시에, dist폴더 하위 모든 파일들을 체크하기 위해 사용
- Terser : 주석 제거, 코드 압축, 변수 이름 축약 등을 통해 JavaScript 코드를 최적화하기 위해 사용

6. 테스트

- mocha : 테스트 코드 실행을 위해 사용
- chai : 테스트 코드 작성을 위해 사용
- chai-http : 테스트 HTTP서버를 위해 사용

7. 기타

- lodash : 컨트롤러에서 중복을 줄이고 간편하게 Unique한 데이터를 추출하기 위해 사용

## 프로젝트 흐름도

- ![프로젝트 흐름도](https://user-images.githubusercontent.com/75871005/260783362-0f1ff452-c654-4b44-bb95-554a721a8edd.png)
