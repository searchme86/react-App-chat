import React, { Component } from 'react';
import { FaRegSmileWink } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
// import Badge from 'react-bootstrap/Badge';
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
    // messagesRef: ref(getDatabase(), 'messages'),
    chatRooms: [],
    firstLoad: true,
    activeChatRoomId: '',
    // notifications: [],
  };

  componentDidMount() {
    this.AddChatRoomsListeners();
  }

  componentWillUnmount() {
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
      // this.addNotificationListener(DataSnapshot.key);
    });
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

  changeChatRoom = (room) => {
    this.props.dispatch(setCurrentChatRoom(room));
    this.props.dispatch(setPrivateChatRoom(false));
    this.setState({ activeChatRoomId: room.id });
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
  };
};

export default connect(mapStateToProps)(ChatRooms);
