# 리액트 채팅앱 (feat 파이어베이스v9)

### 💁🏻 1. 소개
인프런강좌, 리액트와 파이어베이스를 적용한 채팅앱 어플리케이션 강좌를 수강하며, 학습한 코드 입니다.
일부 코드를 개선했습니다.

---

### 😀 2. 강좌를 통해 배운점
강좌에서 코드(리액트) 작동하는 것 이외에 배운 내용을 정리합니다.

+ 공통
  + 버전 업그레이드에 따른, 기존 코드의 지속적인 유지 보수가 필요함 

+ 리액트 
  + 컴포넌트 이해(클래스 컴포넌트와 함수형 컴포넌트의 차이)
    + 코드의 줄 수
      + 코드 가독성    
    + this를 통한 값 참조 
  + 컴포넌트 작성과 조합(composition)
    + 컴포넌트는 확장자를 .jsx로 일반 스크립트는 .js로 작성
    + 아래 개선사항과 연결
  + 상태관리(리덕스) 사용방법 이해
  + UI css-in-js 라이브러리 사용에 주의
    + 빠르게 UI를 만들어주는 장점이 있으나
    + 지속적인 UI 컴포넌트 유지보수 작업이 필요함
      + 버전이 달라지거나 컴포넌트 사용법(예: 컴포넌트에 필요한 props 넣기)이 달라지면, 
      + 이전 정의한 모듈을 사용하지 못하거나 다른 것으로 변경해야하는 상황 발생
  
+ 파이어베이스
  + 파이어베이스 적용방법
  + 파이어베이스의 기능(로그인/DB) 경험

+ 그외 **(개인적 의견)**
  + 주석의 중요성
    + *주석이 없을 경우*, 변수나 함수의 의미 / 컴포넌트의 흐름과정을 *이해하기 어려울 수 있다*
      + this가 있는 코드일 경우 더더욱 그렇다
  + 외부(export)에서 함수를 정의 후, import 해 사용해 가독성 유지   
    + 함수 정의와 함수를 사용하는, 함수 호출을 구분
      +  유지보수성을 위해
  + 확실하게(undefined 아닐경우), 점 연산자(.)를 보다는 구조분해할당으로 코드 가독성 유지
 
---  
  
### 👋🏻 3. 개선
#### 강좌에서 설명한 코드를 다르게 변경한 사례를 소개합니다.
