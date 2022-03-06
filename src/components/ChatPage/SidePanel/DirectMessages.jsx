import React, { Component } from 'react';
import { FaRegSmile } from 'react-icons/fa';
import { connect } from 'react-redux';

import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from '../../../redux/reducers/chatRoom_reducer';
// import {
//   setCurrentChatRoom,
//   // setPrivateChatRoom,
// } from '../../../redux/actions/chatRoom_action';
import { getDatabase, ref, onChildAdded } from 'firebase/database';

class DirectMessages extends Component {
  state = {
    //파베 안에 정의된 users 테이블을 가지고 온다.
    //유저 테이블(userRef)에 있는 유저들을 모두 보여준다.
    usersRef: ref(getDatabase(), 'users'),
    users: [],
    activeChatRoom: '',
  };

  //파베 real-database에 users 테이블에 있는 유저들을 다 보여준다.
  //파베는 데이터에 데이터가 저장될 때마다, 리스너(onChildAdded)를 이용해서 더해진 데이터인 DataSnaphot에넣는다.

  componentDidMount() {
    if (this.props.user) {
      //addUsersListeners는 가입된 유저를 화면에 뿌려주는 리스너
      this.addUsersListeners(this.props.user.uid);
    }
  }

  //addUsersListeners는 가입된 유저를 화면에 뿌려주는 리스너
  addUsersListeners = (currentUserId) => {
    const { usersRef } = this.state;
    let usersArray = [];

    //파베 real-database에 users 테이블에 있는 유저들을 다 보여준다.
    //유저 테이블(userRef)에 있는 유저들을 모두 보여준다.
    //파베는 데이터에 데이터가 저장될 때마다, 리스너(onChildAdded)를 이용해서 더해진 데이터인 DataSnaphot에넣는다.
    onChildAdded(usersRef, (DataSnapshot) => {
      //나의 이름은 빼고 가입된 유저 정보만 보이도록 해야한다.
      if (currentUserId !== DataSnapshot.key) {
        let user = DataSnapshot.val();
        console.log('datasnapshotval', user);
        user['uid'] = DataSnapshot.key;
        user['status'] = 'offline';
        usersArray.push(user);
        this.setState({ users: usersArray });
      }
    });
  };

  //dm, 내가 클릭한 유저와 대화방을 만드는 로직
  //대화를 나눌 채팅방 id를 만들어야 함
  getChatRoomId = (userId) => {
    const currentUserId = this.props.user.uid;

    //userId : 상대방 id(user.uid)
    //currentUserId : 나의 id

    return userId > currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  //어떤 유저를 클릭할때, 그 유저의 정보가 changeChatRoom에 매개변수(user)로 들어간다.
  //클릭한 방으로 이동/변경하는 로직 방을 옮기는 로직
  changeChatRoom = (user) => {
    const chatRoomId = this.getChatRoomId(user.uid);
    const chatRoomData = {
      id: chatRoomId,
      name: user.name,
    };

    this.props.dispatch(setCurrentChatRoom(chatRoomData));
    this.props.dispatch(setPrivateChatRoom(true));
    this.setActiveChatRoom(user.uid);
  };

  setActiveChatRoom = (userId) => {
    this.setState({ activeChatRoom: userId });
  };

  render() {
    const { users } = this.state;
    return (
      <div>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <FaRegSmile style={{ marginRight: 3 }} />
          DIRECT MESSAGES({users.length})
        </span>

        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {users.length > 0 &&
            users.map((user) => {
              return (
                <li
                  key={user.uid}
                  style={{
                    backgroundColor:
                      user.uid === this.state.activeChatRoom && '#ffffff45',
                  }}
                  onClick={() => this.changeChatRoom(user)}
                >
                  # {user.name}
                </li>
              );
            })}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
  };
};

export default connect(mapStateToProps)(DirectMessages);
