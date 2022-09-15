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


+ 개선 완료한 목록
  + 🔨개선 1. jsx에서 (함수가 처리완료된) 값을 바로(선언적으로) return 하지 않고, "다시" 함수를 호출해 그 값을 return 하는 경우
    + 삼항연산자, 함수의 반환내용을 return 안으로 이동하여 코드 개선   
  + 🔨개선 2. Switch 구문에는 모든 조건이 실패될 경우, 마지막에 'default'코드 를 입력한다.
    + 코드 default 추가 
    + 주석, // eslint-disable-next-line no-unused-expressions 입력해 eslint 경고제거 


#### 🔨개선 1. jsx에서 (함수가 처리완료된) 값을 바로(선언적으로) return 하지 않고, "다시" 함수를 호출해 그 값을 return 하는 경우

+ 개선이유
  + jsx 태그 부분은 이미 완료된 값을 반환하는 곳(렌더링 하는 곳)이라고 생각함
  + jsx의 가독성과 코드 흐름을 간편하게 이해하고 싶었음
  + return에서 한번에 반환하면 될 것을, 정의된 함수코드로 이동해서 (컴포넌트를) 반환하는 과정이 어색함

+ 개선이전 
  + jsx에서 함수를 호출하고(함수코드가 정의된 곳으로 엔진이 이동) 호출 값을 jsx에서 보여주기

``` javascript
{this.renderMessageSkeleton(messagesLoading)}
```

``` javascript
{searchTerm
            ? this.renderMessages(searchResults)
            : this.renderMessages(messages)}
```

``` javascript
{this.renderTypingUsers(typingUsers)}
```        
+ 개선이후
  + jsx에서 삼항연산자를 통해, 함수의 인자값으로 값이 들어오면/들어오지 않으면, 함수의 결괏값이 반환되도록 코드 변경   

```javascript
{messagesLoading && (
  <>
      {[...Array(10)].map((v, i) => (
        <Skeleton key={i} />
      ))}
  </>
)}
```

```javascript
{searchTerm
  ? searchResults.length > 0 &&
      searchResults.map((result) => {
         return (
             <ul>
                <MessageSearch
                   key={this.props.user.id}
                   message={result}
                   user={this.props.user}
                />
             </ul>
                );
              })
  : messages.length > 0 &&
       messages.map((message) => {
          return (
             <ul style={{ paddingLeft: '-30px' }} key={this.props.user.id}>
                 <Message
                    key={this.props.user.id}
                    message={message}
                    user={this.props.user}
                 />
             </ul>
                );
  })}

```

```javascript
{typingUsers.length > 0 &&
  typingUsers.map((user) => (
    <span>{user.name.userUid}님이 채팅을 입력하고 있습니다...</span>
))}
```

#### [이전코드]

``` javascript

<!------------ 여기부터 ------------>
renderMessages = (messages) =>
    messages.length > 0 &&
    messages.map((message) => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.props.user}
      />
    ));

  renderTypingUsers = (typingUsers) => {
    return (
      typingUsers.length > 0 &&
      typingUsers.map((user) => (
        <span>{user.name.userUid}님이 채팅을 입력하고 있습니다...</span>
      ))
    );
  };
  
renderMessageSkeleton = (loading) =>
    loading && (
      <>
        {[...Array(10)].map((v, i) => (
          <Skeleton key={i} />
        ))}
      </>
    );
    
 <!------------ 여기까지 변경됩니다. ------------>

  render() {
    const {
      messages,
      searchTerm,
      searchResults,
      typingUsers,
      messagesLoading,
    } = this.state;
    return (
      <div style={{ padding: '2rem 2rem 0 2rem' }}>
        <MessageHeader handleSearchChange={this.handleSearchChange} />

        <div
        -중략-
        >
        
        <!------------ 여기부터 ------------>
          {this.renderMessageSkeleton(messagesLoading)}

          {searchTerm
            ? this.renderMessages(searchResults)
            : this.renderMessages(messages)}

          {this.renderTypingUsers(typingUsers)}
          
        <!------------ 여기까지 변경됩니다. ------------>
        
        </div>

        <MessageForm />
      </div>
    );
  }
```

#### [개선코드]

```javascript
<!------------ 여기부터  ------------>
-함수정의된 곳-
<!------------ 여기까지 정의된 함수가 삭제됐습니다. ------------>
 render() {
    const {
      messages,
      searchTerm,
      searchResults,
      typingUsers,
      messagesLoading,
    } = this.state;

    return (
      <div style={{ padding: '2rem 2rem 0 2rem' }}>
        <MessageHeader handleSearchChange={this.handleSearchChange} />
        <div
          style={{
            width: '100%',
            height: '450px',
            border: '.2rem solie #ececec',
            padding: '1rem',
            marginBottom: '1rem',
            overflow: 'auto',
          }}
        >
        <!------------ 기존 함수가 여기부터 ------------>
          {messagesLoading && (
            <>
              {[...Array(10)].map((v, i) => (
                <Skeleton key={i} />
              ))}
            </>
          )}

          {searchTerm
            ? searchResults.length > 0 &&
              searchResults.map((result) => {
                return (
                  <ul>
                    <MessageSearch
                      key={this.props.user.id}
                      message={result}
                      user={this.props.user}
                    />
                  </ul>
                );
              })
            : messages.length > 0 &&
              messages.map((message) => {
                return (
                  <ul style={{ paddingLeft: '-30px' }} key={this.props.user.id}>
                    <Message
                      key={this.props.user.id}
                      message={message}
                      user={this.props.user}
                    />
                  </ul>
                );
              })}

          {typingUsers.length > 0 &&
            typingUsers.map((user) => (
              <span>{user.name.userUid}님이 채팅을 입력하고 있습니다...</span>
            ))}
            <!------------ 여기까지 영역으로 이동됐습니다.  ------------>
          <div ref={(node) => (this.messageEndRef = node)} />
        </div>
        <MessageForm />
      </div>
    );
  }


```

#### 🔨 개선 2. Switch 구문에는 모든 조건이 실패될 경우, 마지막에 'default'코드 를 입력한다.

### 상황
#### 애플리케이션의 기능 중, "파일의 업로드 비율(%) 프로그래스바'는 파이어베이스 v8 버전의 코드입니다.
#### v9로 버전이 변경 되면서, v9버전의 설정 코드를 제공 받았는데, 이를 프로젝트에 ***그대로*** 적용해 eslint 경고를 경험했습니다.
#### 파이어베이스 공식 문서(https://firebase.google.com/docs/storage/web/upload-files?hl=ko#web-version-9_6) 중, v9버전의 코드는 default 키워드가 없습니다.('error-code'부분)

### defalt-case ( https://eslint.org/docs/latest/rules/default-case )
#### Require default cases in switch statements

#### [이전코드]
````javascript
 (snapshot) => {
  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
     console.log('Upload is ' + progress + '% done');
     switch (snapshot.state) {
         case 'paused':
               console.log('Upload is paused');
               break;
         case 'running':
               console.log('Upload is running');
               break;
      }
   },
   
   (error) => {
   // A full list of error codes is available at
   // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
          case 'storage/unauthorized':
             // User doesn't have permission to access the object
             break;
          case 'storage/canceled':
             // User canceled the upload
             break;
             // ...
          case 'storage/unknown':
             // Unknown error occurred, inspect error.serverResponse
             break;
       }
    },
  
```




````javascript

```





