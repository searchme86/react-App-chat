import React, { Component } from 'react';
import { FaRegSmileWink } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import {
  getDatabase,
  ref,
  onChildAdded,
  onValue,
  push,
  child,
  update,
  off,
} from 'firebase/database';
import { connect } from 'react-redux';
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from '../../../redux/reducers/chatRoom_reducer';

export class ChatRooms extends Component {
  state = {
    show: false,
    name: '',
    description: '',
    //chatroom의 테이블에 접근(ref)
    chatRoomsRef: ref(getDatabase(), 'chatRooms'),
    messagesRef: ref(getDatabase(), 'messages'),
    chatRooms: [],
    firstLoad: true,
    activeChatRoomId: '',
    //notification 정보가 들어갈 빈 배열
    notifications: [],
  };

  componentDidMount() {
    this.AddChatRoomsListeners();
  }

  componentWillUnmount() {
    //[notification 마지막 처리 ]
    //처음에 AddChatRoomsListeners가 마운트 되면서 시작이 됐고,
    //첫번째 방, 두번째 방을 누를때 모든 방이 함수 AddChatRoomsListeners을 사용하면서
    //chatRoomRef를 사용했기 때문에, 컴포넌트가 없어질 때, 이 chatRoomRef을 해제해야한다.
    //모든 정보가 chatroom에 연결되어 있는 상태다
    off(this.state.chatRoomsRef);
  }

  setFirstChatRoom = () => {
    const firstChatRoom = this.state.chatRooms[0];
    if (this.state.firstLoad && this.state.chatRooms.length > 0) {
      this.props.dispatch(setCurrentChatRoom(firstChatRoom));
      this.setState({ activeChatRoomId: firstChatRoom.id });
    }
    this.setState({ firstLoad: false });
  };

  //chatRoom을 데이터베이스에서 하나하나씩 가져오는 이벤트 리스너
  //저장된 데이터를 보여주는 이벤트 리스너

  AddChatRoomsListeners = () => {
    let chatRoomsArray = [];

    //실시간으로 데이터가 들어오는 지를 확인 할 수 있음
    //chatRoomsRef는 chatRooms 테이블을 가리킨다.
    //onChildAdded : 어떠한 데이터가 added되면은
    //DataSnapshot: 들어온 데이터
    onChildAdded(this.state.chatRoomsRef, (DataSnapshot) => {
      chatRoomsArray.push(DataSnapshot.val());
      console.log('chatRoomsArray', chatRoomsArray);
      //state에 chatroom 정보를 넣은 후에 함수 setFirsttChatRoom 함수를 호출
      //임의로 첫번째 방이 선택되도록 설정하는 로직
      //chatroom이 설정되면 함수 setFirstchatRoom이 실행된다.
      this.setState({ chatRooms: chatRoomsArray }, () =>
        this.setFirstChatRoom()
      );
      //[notification]
      // notification 기능을 구현할 때, 각 방에 정보가 변하는 것을 확인하려면, 해당 방(첫째방, 둘째방,,)의 id를 알아야 하고, 알 수 있는 리스너
      //방을 만들 때, 새로 만들어진 방의 정보(chatRooms)를 저장하는 곳
      //DataSnapshot 안에 각 방의 아이디 정보가 존재한다
      //DataSnapshot.key 는 채팅방의 아이디를 의미
      //채팅룸 정보를 가져올 때, 알림 정보 리스너도 추가한다.
      //파베는 데이터가 add되면 이벤트 리스너가 실행된다.
      console.log('문제를 파악중임', DataSnapshot.key);
      this.addNotificationListener(DataSnapshot.key);
    });
  };

  //들어오는 인자 chatRoomId 는 채팅방의 아이디를 의미
  addNotificationListener = (chatRoomId) => {
    //chatRoom 테이블(collection)에서 해당 chatRoom id에 해당하는 정보를 가져와여 한다.
    let { messagesRef } = this.state;
    //chatRoomId은 chatroom 테이블 로우,
    //데이터가 어떤 chatRoomId에 들어갈 것인지 설정한다.
    console.log('여기보임?1');
    onValue(child(messagesRef, chatRoomId), (DataSnapshot) => {
      console.log('여기보임?2');
      console.log('DataSnapshotㅇㅇ', DataSnapshot);
      if (this.props.chatRoom) {
        this.handleNotification(
          chatRoomId,
          this.props.chatRoom.id,
          this.state.notifications,
          //메세지 정보들
          DataSnapshot
        );
      }
    });
  };

  handleNotification = (
    //첫번째, 두번째, 세번째 방의 id를 의미함
    // 위에서 this.addNotificationListener(DataSnapshot.key);에서
    //DataSnapshot.key는 첫번째 두번째 세번째 방의 id가 들어오게 됨
    chatRoomId,
    //this.props.chatRoom.id가 currentChatRoomId를 의미함
    currentChatRoomId,
    //위에서 선언한  notifications: [],을 의미함
    notifications,
    //메세지 테이블 messagesRef 아래 로우 chatRoomId에 해당하는 정보들
    DataSnapshot
  ) => {
    console.log('나옴?');
    console.log('문제를 파악중임,currentChatRoomId ', currentChatRoomId);
    console.log('문제를 파악중임,DataSnapshot ', DataSnapshot);
    console.log('문제를 파악중임,notifications ', notifications);
    console.log('문제를 파악중임,chatRoomId ', chatRoomId);

    let lastTotal = 0;
    // 이미 notifications state 안에 알림 정보가 들어있는 채팅방과 그렇지 않은 채팅방을 나눠주기
    //최신의 정보는 notification에 등록되어 있지 않다?

    let index = notifications.findIndex(
      (notification) => notification.id === chatRoomId
    );

    console.log('현재 Index는 다음과 같습니다', index);

    //notifications state 안에 해당 채팅방의 알림 정보가 없을 때
    if (index === -1) {
      //채팅방 정보가 없을 경우, 채팅방 하나 하나에 맞는 해당 알림정보를 생성해야한다.
      //초기 값을 만든다.
      notifications.push({
        // 해당 채팅방의 아이디, 첫번째, 두번째 , 세번째 방의 아이디
        id: chatRoomId,
        //해당 채팅방의 전체 메세지 갯수
        total: DataSnapshot.size,
        //이전에 확인한 전체 메세지 갯수
        lastKnownTotal: DataSnapshot.size,
        // 화면에 나올 숫자
        count: 0,
      });
      console.log('현재 notifications의 상태는', notifications);
    }
    // 이미 해당 채팅방의 알림 정보가 notifications에 있을 떄
    else {
      //그리고 상대방이 채팅 보내는 그 해당 채팅방에 있지 않을 때(첫번째 방에 있는 상대방은 다른방에서 나에게 채팅을 보낼 경우)
      //나와 상대방의 채팅방이 다를 경우에, 나와 같으 방에 있다면 알림이 필요없기 때문에
      //다른 방에 있는 사람에게 메세지를 보내는 것 = 서로 방이 다를 경우에
      console.log('여기가 중요 chatRoomId', chatRoomId);
      console.log('여기가 중요currentChatRoomId ', currentChatRoomId);
      if (chatRoomId !== currentChatRoomId) {
        //현재까지 유저가 확인한 총 메시지 개수(현재 나는 2번째에 있는데, 이전에 있었던 방의 매세지 갯수)
        lastTotal = notifications[index].lastKnownTotal;
        //count (알림으로 보여줄 숫자)를 구하기
        //현재 총 메시지 개수DataSnapshot.size - 이전에 확인한 총 메시지 개수lastTotal > 0
        //이전보다 더 증감된 메세지 갯수가 몇개인지를 계산한
        //현재 총 메시지 개수가 10개이고 이전에 확인한 메시지가 8개 였다면 2개를 알림으로 보여줘야함.
        if (DataSnapshot.size - lastTotal > 0) {
          notifications[index].count = DataSnapshot.size - lastTotal;
        }
      }
      //total property에 현재 전체 메시지 개수를 넣어주기
      notifications[index].total = DataSnapshot.size;
    }
    // 목표는 방 하나 하나의 맞는 알림 정보를 notifications state에  넣어주기
    this.setState({ notifications });
  };

  //해당 채팅방의 count수를 구함
  getNotificationCount = (room) => {
    let count = 0;
    console.log('현재 notifications', this.state.notifications);
    console.log('현재 room', room);
    console.log('현재 room id', room.id);
    this.state.notifications.forEach((notification) => {
      if (notification.id === room.id) {
        count = notification.count;
      } else {
        console.log('현재 notification의 id와 일치하는 room id가 없습니다 ');
      }
    });
    if (count > 0) return count;
  };

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  handleSubmit = (e) => {
    e.preventDefault();
    const { name, description } = this.state;
    if (this.isFormValid(name, description)) {
      this.addChatRoom();
    }
  };

  addChatRoom = async () => {
    const key = push(this.state.chatRoomsRef).key;
    const { name, description } = this.state;
    const { user } = this.props;
    const newChatRoom = {
      id: key,
      name: name,
      description: description,
      createdBy: {
        name: user.displayName,
        image: user.photoURL,
      },
    };
    try {
      //어떤 row
      await update(child(this.state.chatRoomsRef, key), newChatRoom);
      this.setState({
        name: '',
        desription: '',
        show: false,
      });
    } catch (error) {
      console.log('chatRoom 관련 작업 중에 발생한 에러는', error);
    }
  };

  isFormValid = (name, description) => name && description;

  clearNotifications = () => {
    let index = this.state.notifications.findIndex(
      //this.props.chatRoom.id 현재 chatroom의 id
      //마우스를 클릭한 방(첫째방, 둘째방, 셋째방)의 아이디에 해당하는 id가 notification 알림에 들어 있다면,
      (notification) => notification.id === this.props.chatRoom.id
    );
    if (index !== -1) {
      //해당하는 id가 있다면,
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].lastKnownTotal =
        this.state.notifications[index].total;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };

  changeChatRoom = (room) => {
    this.props.dispatch(setCurrentChatRoom(room));
    this.props.dispatch(setPrivateChatRoom(false));
    this.setState({ activeChatRoomId: room.id });
    //notification 클릭해서 없애주기
    this.clearNotifications();
  };

  renderChatRooms = (chatRooms) =>
    chatRooms.length > 0 &&
    chatRooms.map((room) => (
      <li
        key={room.id}
        style={{
          backgroundColor:
            room.id === this.state.activeChatRoomId && '#ffffff45',
        }}
        onClick={() => this.changeChatRoom(room)}
      >
        # {room.name}
        {console.log('<badge 태그 전>', room)}
        <Badge style={{ float: 'right', marginTop: '4px' }} variant="danger">
          {this.getNotificationCount(room)}
        </Badge>
      </li>
    ));

  render() {
    return (
      <div>
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FaRegSmileWink
            style={{ marginRight: 3, right: 0, cursor: 'pointer' }}
          />
          CHAT ROOMS (1)
          <FaPlus
            onClick={this.handleShow}
            style={{ position: 'absolute', right: 0, cursor: 'pointer' }}
          />
        </div>

        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {this.renderChatRooms(this.state.chatRooms)}
        </ul>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create a chat room</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>방 이름</Form.Label>
                <Form.Control
                  onChange={(e) => this.setState({ name: e.target.value })}
                  type="text"
                  placeholder="Enter a chat room name"
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>방 설명</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    this.setState({ description: e.target.value })
                  }
                  type="text"
                  placeholder="Enter a chat room description"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleSubmit}>
              Create
            </Button>
          </Modal.Footer>
        </Modal>
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

export default connect(mapStateToProps)(ChatRooms);
