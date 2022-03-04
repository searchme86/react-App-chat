import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import firebase from '../../../firebase';
import { useSelector } from 'react-redux';
// import mime from 'mime-types';
import { getDatabase, ref, set, remove, push, child } from 'firebase/database';
// import {
//   getStorage,
//   ref as strRef,
//   uploadBytesResumable,
//   getDownloadURL,
// } from 'firebase/storage';

function MessageForm() {
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  //메세지 테이블 정의
  const messagesRef = ref(getDatabase(), 'messages');

  //리덕스의 정보를 가져옴
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const user = useSelector((state) => state.user.currentUser);

  const createMessage = (fileUrl = null) => {
    const message = {
      timestamp: new Date(),
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL,
      },
    };
    if (fileUrl !== null) {
      message['image'] = fileUrl;
    } else {
      message['content'] = content;
    }
    return message;
  };

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async () => {
    if (!content) {
      setErrors((prev) => prev.concat('텍스트를 먼저 작성해주세요'));
      return;
    }
    setLoading(true);

    try {
      //firebase에 메시지를 저장하는 부분
      //---firebase 데이터베이스에 접근하는 것
      //채팅방 id를 child로 넣어준다.
      //chatRoom.id은 좌측 클릭한 방의 아이디, 리덕스 스토어에 저장되어 있음
      //모든 정보를 데이터에 set하기 위해 set()을 한다.
      await set(push(child(messagesRef, chatRoom.id)), createMessage());
      //   await remove(child(typingRef, `${chatRoom.id}/${user.uid}`));
      //메세지를 모두 보낸 후에 초기화를 한다
      setLoading(false);
      setContent('');
      setErrors([]);
    } catch (error) {
      setErrors((pre) => pre.concat(error.message));
      setLoading(false);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Control
            // onKeyDown={handleKeyDown}
            value={content}
            onChange={handleChange}
            as="textarea"
            style={{ width: '100%', height: '100%' }}
          />
        </Form.Group>
      </Form>

      <ProgressBar variant="warning" label={`${60}%`} now={60} />
      {/* {!(percentage === 0 || percentage === 100) && (
        <ProgressBar
          variant="warning"
          label={`${percentage}%`}
          now={percentage}
        />
      )} */}

      <div>
        {errors.map((errorMsg) => (
          <p style={{ color: 'red' }} key={errorMsg}>
            {errorMsg}
          </p>
        ))}
      </div>

      <Row>
        <Col>
          <button
            onClick={handleSubmit}
            className="message-form-button"
            style={{ width: '100%' }}
            // disabled={loading ? true : false}
          >
            SEND
          </button>
        </Col>
        <Col>
          <button
            // onClick={handleOpenImageRef}
            className="message-form-button"
            style={{ width: '100%' }}
            // disabled={loading ? true : false}
          >
            UPLOAD
          </button>
        </Col>
      </Row>

      <input
      // accept="image/jpeg, image/png"
      // style={{ display: 'none' }}
      // type="file"
      // ref={inputOpenImageRef}
      // onChange={handleUploadImage}
      />
    </div>
  );
}

export default MessageForm;
