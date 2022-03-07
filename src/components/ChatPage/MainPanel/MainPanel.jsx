import React, { Component } from 'react';
import MessageHeader from './MessageHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import {
  getDatabase,
  ref,
  onChildAdded,
  onChildRemoved,
  child,
  off,
} from 'firebase/database';
import { connect } from 'react-redux';
import MessageSearch from './MessageSearch';

import { setUserPosts } from '../../../redux/reducers/chatRoom_reducer';
// import Skeleton from '../../../commons/components/Skeleton';

class MainPanel extends Component {
  state = {
    messages: [],
    //메세지 파이어베이스 테이블에 접근함
    messagesRef: ref(getDatabase(), 'messages'),
    messagesLoading: true,
    searchTerm: '',
    searchResults: [],
    searchLoading: false,
    typingRef: ref(getDatabase(), 'typing'),
    typingUsers: [],
    listenerLists: [],
  };

  //메세지를 실시간으로 가져오기
  //파이어베이스는 데이터가 add되면 이벤트 리스너가 실행되는 것으로 알림
  //[chapter. 방을 만든 사람의 정보 보여주기]
  addMessagesListeners = (chatRoomId) => {
    //메세지를 하나하나 넣어주기 위해 []
    let messagesArray = [];
    let { messagesRef } = this.state;

    //하나하나 파베 테이블에 들어온 데이터를 []에 넣어줌
    //메세지를 저장하기
    onChildAdded(child(messagesRef, chatRoomId), (DataSnapshot) => {
      messagesArray.push(DataSnapshot.val());
      this.setState({
        messages: messagesArray,
        messagesLoading: false,
      });
      //1.[chapter. 방을 만든 사람의 정보 보여주기]
      this.userPostsCount(messagesArray);
    });
  };

  //2.[chapter. 방을 만든 사람의 정보 보여주기]
  //유저가 작성한 메세지의 갯수를 세는 로직
  //userPosts라는 테이블을 만드는데 필요한 데이터 객체를 만드는 곳
  userPostsCount = (messages) => {
    let userPosts = messages.reduce((acc, message) => {
      if (message.user.name in acc) {
        //name이 있을 경우엔 count만 늘려준다.
        acc[message.user.name].count += 1;
      } else {
        //해당 값이 없을 경우에
        acc[message.user.name] = {
          image: message.user.image,
          //해당 내용이 없기때문에, 해당 내용이 검색이 안되서 1로 설정
          //이것부터 시작한다는 의미
          count: 1,
        };
      }
      return acc;
    }, {});
    this.props.dispatch(setUserPosts(userPosts));
    // 이후에 MessageHeader.jsx의 renderUserPosts로 로직이 이동한다.
  };

  componentDidMount() {
    //리덕스로 가져온 chatRoom
    const { chatRoom } = this.props;
    if (chatRoom) {
      //메세지를 실시간으로 가져오기
      //해당 방에 해당하는 것이기에 chatRoom.id를 넣는다.
      this.addMessagesListeners(chatRoom.id);
      // this.addTypingListeners(chatRoom.id);
    }
  }

  //메세지를 입력해 검색하는 함수
  //인풋에 입력한 텍스트와 비슷한 메세지를 찾는 로직
  handleSearchMessages = () => {
    const chatRoomMessages = [...this.state.messages];
    //searchTerm : 인풋에 내가 입력한 텍스트들이 들어가는 변수, 찾고자 하는 것
    //두번째, gi는 찾는 옵션임, g는 그것과 관련된 모든 찾는 글로벌적인 것을 match하고 i는 대문자 소문자 가리지 않고 모든 insensivive하게 모든 정보를 찾도록 돕는 옵션
    const regex = new RegExp(this.state.searchTerm, 'gi');
    const searchResults = chatRoomMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
    //이후에 MessageBody로 로직이 이동한다.
  };

  //MessageHeader 컴포넌트에 함수를 props로 전달함
  handleSearchChange = (event) => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true,
      },
      // 메세지를 입력하고 나서 바로 함수가 실행함
      () => this.handleSearchMessages()
    );
  };

  render() {
    const {
      messages,
      searchTerm,
      searchResults,
      // typingUsers,
      // messagesLoading,
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
        </div>
        <MessageForm />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom,
  };
};

export default connect(mapStateToProps)(MainPanel);
