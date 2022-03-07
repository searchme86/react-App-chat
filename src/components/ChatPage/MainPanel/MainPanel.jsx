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
    //typing 테이블을 가져옴
    typingRef: ref(getDatabase(), 'typing'),
    typingUsers: [],
    listenerLists: [],
  };

  componentDidMount() {
    //리덕스로 가져온 chatRoom
    const { chatRoom } = this.props;
    if (chatRoom) {
      //메세지를 실시간으로 가져오기
      //해당 방에 해당하는 것이기에 chatRoom.id를 넣는다.
      this.addMessagesListeners(chatRoom.id);
      //섹션, typing 정보부분
      this.addTypingListeners(chatRoom.id);
    }
  }

  componentWillUnmount() {
    //addMessageListeners의 'child_add' 이벤트의 내용을 해제하는 곳
    //onChildAdded(child(messagesRef, chatRoomId), (DataSnapshot) 이거 내용을 해제하는 곳
    off(this.state.messagesRef);

    this.removeListeners(this.state.listenerLists);
  }

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

  //[typing 관련 함수]
  addToListenerLists = (id, ref, event) => {
    //이벤트에 해당하는 리스너가 이미 등록된 리스너인지 확인
    const index = this.state.listenerLists.findIndex((listener) => {
      return (
        listener.id === id && listener.ref === ref && listener.event === event
      );
    });
    //해당 리스너가 없다면, 새로 등록된 리스너만
    if (index === -1) {
      const newListener = { id, ref, event };
      this.setState({
        listenerLists: this.state.listenerLists.concat(newListener),
      });
    }
  };

  //[typing 관련 함수]
  removeListeners = (listeners) => {
    listeners.forEach((listner) => {
      //listner.event는 child_added 부분이
      //listner.id는 방 id
      off(ref(getDatabase(), `messages/${listner.id}`), listner.event);
    });
  };

  //[섹션: typing]
  //폼에 텍스트가 입력될때 실행되는 리스너
  addTypingListeners = (chatRoomId) => {
    let typingUsers = [];
    //typing이 새로 들어올 때
    let { typingRef } = this.state;

    onChildAdded(child(typingRef, chatRoomId), (DataSnapshot) => {
      //DataSnapshot 현재 타이핑중인 유저의 정보인데,
      //this.props.user.uid 현재 로그인한 유저임,
      //현재 유저가 아닌, 다른 유저의 정보가 저장되어야 해서 !==한다.
      //그래서 key가 다른 경우만 저장한다.
      if (DataSnapshot.key !== this.props.user.uid) {
        typingUsers = typingUsers.concat({
          //user의 uid가 저장됨
          id: DataSnapshot.key,
          //타이핑하고 있는 사람의 이름
          name: DataSnapshot.val(),
        });
        console.log('3/7추가되는typingUsers ', typingUsers);
        this.setState({ typingUsers });
      }
    });

    //onChildAdded 하고서 addToListenerLists에 넣어준다.
    //listenersList state에 onChildAdded에 해당하는 리스너를 넣어주기
    this.addToListenerLists(chatRoomId, this.state.typingRef, 'child_added');

    //내가 타이핑을 작성하고 있는데, 그 타이핑을 지울 때,
    //typing 데이터베이스에서도 지워야 함 지워줄 때
    //타이핑 정보가 타이핑 데이터베이스에 지우면 리덕스 스토어에서도 지워도록 적용함
    //onChildRemoved child, child가 지워질때
    //타이핑 정보가 데이터베이스에서 제거되면 state에서도 지워주기
    onChildRemoved(child(typingRef, chatRoomId), (DataSnapshot) => {
      const index = typingUsers.findIndex(
        // state typingUsers 안에 있는 유저가 폼에 글을 쓰는 유저( DataSnapshot.key)인지를 확인
        (user) => user.id === DataSnapshot.key
      );
      if (index !== -1) {
        //만약 폼을 작성하는 유저가 state typingUsers에 있었다면,
        //그 유저를 상태에서 제거해야한다.
        //DataSnapshot.key : 현재 폼에 텍스트를 입력하는 유저
        console.log('3/7 filter 전 ', DataSnapshot.key);

        typingUsers = typingUsers.filter(
          //DataSnapshot.key를 지워야 함
          //filter는 콜백에 해당되는 내용의 결과를 리턴한다
          //지우기 위해서 filter을 한다.
          //a를 뺀다라는 것은 a가 아닌 것만 보여준다/반환한다(return)라는 의미
          //즉 DataSnapshot.key를 뺀다라는 건, !DataSnapshot.key인것을 반환하는 의미
          //!DataSnapshot.key를 return 함으로, DataSnapshot.key는 빠지는 효과를 갖게됨
          (user) => user.id !== DataSnapshot.key
        );
        console.log('3/7 filter 후 ', typingUsers);
        this.setState({ typingUsers });
      }
    });

    //onChildRemoved이벤트에 해당하는 리스너를 listenersList state에 넣어주기
    this.addToListenerLists(chatRoomId, this.state.typingRef, 'child_removed');
  };

  render() {
    const {
      messages,
      searchTerm,
      searchResults,
      typingUsers,
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

          {typingUsers.length > 0 &&
            typingUsers.map((user) => (
              <span>{user.name.userUid}님이 채팅을 입력하고 있습니다...</span>
            ))}
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
