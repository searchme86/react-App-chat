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
// import { setUserPosts } from '../../../redux/actions/chatRoom_action';
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
      // this.userPostsCount(messagesArray);
    });
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

  render() {
    const {
      messages,
      // searchTerm,
      // searchResults,
      // typingUsers,
      // messagesLoading,
    } = this.state;

    return (
      <div style={{ padding: '2rem 2rem 0 2rem' }}>
        <MessageHeader />
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
          {messages.length > 0 &&
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
