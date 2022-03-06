import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Image from 'react-bootstrap/Image';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { FaLock } from 'react-icons/fa';
import { FaLockOpen } from 'react-icons/fa';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector } from 'react-redux';
// import { Media } from 'react-bootstrap';
import {
  getDatabase,
  ref,
  onValue,
  remove,
  child,
  update,
} from 'firebase/database';

function MessageHeader({ handleSearchChange }) {
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const isPrivateChatRoom = useSelector((state) => state.chatRoom.isPrivate);
  const [isFavorited, setIsFavorited] = useState(false);
  //유저테이블의 정보
  const usersRef = ref(getDatabase(), 'users');
  //현재 로그인한 유저, 유저정보
  const user = useSelector((state) => state.user.currentUser);
  // const userPosts = useSelector((state) => state.chatRoom.userPosts);
  useEffect(() => {
    if (chatRoom && user) {
      //브라우저를 리프레쉬해도 좋아요 한 것을 계속 유지하려고 useEffect를 하는데,
      addFavoriteListener(chatRoom.id, user.uid);
    }
  }, []);

  //파베는 데이터가 있으면 이벤트 리스너를 실행하는 방식이라,
  //페이지 새로 고침에도 좋아요 표시 남아있도록 해주기
  //addFavoriteListener라는 이벤트리스너를 정의함
  const addFavoriteListener = (chatRoomId, userId) => {
    //useRef, users의 테이블
    onValue(child(usersRef, `${userId}/favorited`), (data) => {
      //좋아요한 방이 있다면,
      if (data.val() !== null) {
        console.log('data.val()', data.val());
        const chatRoomIds = Object.keys(data.val());
        console.log('chatRoomIds', chatRoomIds);
        const isAlreadyFavorited = chatRoomIds.includes(chatRoomId);
        setIsFavorited(isAlreadyFavorited);
      }
    });
  };

  const handleFavorite = () => {
    if (isFavorited) {
      setIsFavorited((prev) => !prev);
      //클릭되어 있으면 userRef에서 삭제한다.
      //이미 클릭이 되어 있으면
      remove(child(usersRef, `${user.uid}/favorited/${chatRoom.id}`));
    } else {
      setIsFavorited((prev) => !prev);
      //클릭이 되지 않았을 때,
      //유저 collection에 추가한다.
      //favorite한 이름으로 묶인다
      update(child(usersRef, `${user.uid}/favorited`), {
        //그 아래 favorite한 방의 정보가 저장된다.
        //이런 정보가 userRef에 저장이 된다.
        [chatRoom.id]: {
          name: chatRoom.name,
          description: chatRoom.description,
          createdBy: {
            name: chatRoom.createdBy.name,
            image: chatRoom.createdBy.image,
          },
        },
      });
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '170px',
        border: '.2rem solid #ececec',
        borderRadius: '4px',
        padding: '1rem',
        marginBottom: '1rem',
      }}
    >
      <Container>
        <Row>
          <Col>
            <h2>
              {isPrivateChatRoom ? (
                <FaLock style={{ marginBottom: '10px' }} />
              ) : (
                <FaLockOpen style={{ marginBottom: '10px' }} />
              )}

              {chatRoom && chatRoom.name}

              {!isPrivateChatRoom && (
                <span style={{ cursor: 'pointer' }} onClick={handleFavorite}>
                  {isFavorited ? (
                    <MdFavorite style={{ marginBottom: '10px' }} />
                  ) : (
                    <MdFavoriteBorder style={{ marginBottom: '10px' }} />
                  )}
                </span>
              )}
            </h2>
          </Col>

          <Col>
            <InputGroup className="mb-3">
              <InputGroup>
                <InputGroup.Text id="basic-addon1">
                  <AiOutlineSearch />
                </InputGroup.Text>
              </InputGroup>
              <FormControl
                onChange={handleSearchChange}
                placeholder="Search Messages"
                aria-label="Search"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <p>
            <Image
            // src={chatRoom && chatRoom.createdBy.image}
            // roundedCircle
            // style={{ width: '30px', height: '30px' }}
            />{' '}
            {/* {chatRoom && chatRoom.createdBy.name} */}
          </p>
        </div>
        <Row>
          <Col>
            {/* <Accordion>
              <Card>
                <Card.Header></Card.Header>
                <Accordion.Collapse>
                  <Card.Body></Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Card.Header></Card.Header>
                <Accordion.Collapse>
                  <Card.Body></Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion> */}
          </Col>
          <Col>
            {/* <Accordion>
              <Card>
                <Card.Header></Card.Header>
                <Accordion.Collapse>
                  <Card.Body></Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion> */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MessageHeader;
