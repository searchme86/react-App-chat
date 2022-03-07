import React, { Component } from 'react';
import { FaRegSmileBeam } from 'react-icons/fa';
import { connect } from 'react-redux';
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from '../../../redux/reducers/chatRoom_reducer';

import {
  child,
  getDatabase,
  ref,
  onChildAdded,
  onChildRemoved,
  off,
} from 'firebase/database';

class Favorite extends Component {
  state = {
    favoritedChatRooms: [],
    activeChatRoomId: '',
    userRef: ref(getDatabase(), 'users'),
  };

  componentDidMount() {
    if (this.props.user) {
      this.addListeners(this.props.user.uid);
    }
  }

  componentWillUnmount() {
    if (this.props.user) {
      this.removeListener(this.props.user.uid);
    }
  }

  removeListener = (userId) => {
    const { userRef } = this.state;
    off(child(userRef, `${userId}/favoried`));
  };

  //하트를 클릭해서 데이터가 테이블에 add 되었을때, 호출되는 리스너를 등록함
  addListeners = (userId) => {
    const { userRef } = this.state;
    //하트를 클릭하면, childadded가 되고
    //더해진것에 대한 정보는 DataSnapshot 이다
    onChildAdded(child(userRef, `${userId}/favorited`), (DataSnapshot) => {
      const favoritedChatRoom = { id: DataSnapshot.key, ...DataSnapshot.val() };
      this.setState({
        favoritedChatRooms: [
          ...this.state.favoritedChatRooms,
          favoritedChatRoom,
        ],
      });
    });

    //하트를 해제하면, childremoved가 되고
    //removed된 child를 빼주는 액션
    onChildRemoved(child(userRef, `${userId}/favorited`), (DataSnapshot) => {
      const chatRoomToRemove = { id: DataSnapshot.key, ...DataSnapshot.val() };
      const filteredChatRooms = this.state.favoritedChatRooms.filter(
        (chatRoom) => {
          return chatRoom.id !== chatRoomToRemove.id;
        }
      );
      this.setState({ favoritedChatRooms: filteredChatRooms });
    });
  };

  changeChatRoom = (room) => {
    this.props.dispatch(setCurrentChatRoom(room));
    this.props.dispatch(setPrivateChatRoom(false));
    this.setState({ activeChatRoomId: room.id });
  };

  render() {
    const { favoritedChatRooms } = this.state;
    return (
      <div>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <FaRegSmileBeam style={{ marginRight: '3px' }} />
          FAVORITED ({favoritedChatRooms.length})
        </span>
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          {favoritedChatRooms.length > 0 &&
            favoritedChatRooms.map((chatRoom) => (
              <li
                key={chatRoom.id}
                onClick={() => this.changeChatRoom(chatRoom)}
                style={{
                  backgroundColor:
                    chatRoom.id === this.state.activeChatRoomId && '#ffffff45',
                }}
              >
                # {chatRoom.name}
              </li>
            ))}
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

export default connect(mapStateToProps)(Favorite);
