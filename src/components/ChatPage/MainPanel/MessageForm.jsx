import React, { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import firebase from '../../../firebase';
import { useSelector } from 'react-redux';
import mime from 'mime';
import { getDatabase, ref, set, remove, push, child } from 'firebase/database';
import {
  getStorage,
  ref as strRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

function MessageForm() {
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  //메세지 테이블 정의
  const messagesRef = ref(getDatabase(), 'messages');

  //리덕스의 정보를 가져옴
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const user = useSelector((state) => state.user.currentUser);
  const isPrivateChatRoom = useSelector((state) => state.chatRoom.isPrivate);

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

  //인풋에 대한 ref를 설정함
  const inputOpenImageRef = useRef();

  //설정한 인풋 ref를 클릭하도록 설정하는 함수
  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };

  const getPath = () => {
    if (isPrivateChatRoom) {
      return `/message/private/${chatRoom.id}`;
    } else {
      return `/message/public`;
    }
  };

  //input의 onchange할때 호출되는 함수
  //이미지를 고르고 올리는 함수
  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    // console.log('file', file);

    //파일을 어디에 저장할지, 어떤 이름으로 저장할지, message라는 폴더 안에 그아래 public에 넣을 것임을 설정함
    //프로파일 저장한 방법과 동일함
    const storage = getStorage();
    const filePath = `${getPath()}/${file.name}`;
    // console.log('filePath', filePath);
    const metadata = { contentType: mime.getType(file.name) };
    setLoading(true);

    //스토리지에 이미지를 저장을 해야한다
    try {
      //스토리지에 파일을 저장한다
      const storageRef = strRef(storage, filePath);
      // console.log(storageRef);
      //스토리지에 파일을 업로드 한다,
      //파베 storaged에 파일을 업로드 한다,
      //storage에 message 폴더 아래, public에 파일이 저장된다, 핵심(uploadBytesResumable)
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      //파일을 업로드 할때, 업로드 되는 상태에 따라, 퍼센테이지 바가 움직이도록 설정을 함
      //파일 저장 퍼센테지 기능
      // 리스너는 state~ 임, 이 리스너가 작동해서  파이어베이스에서  snapshot 정보를 준다,
      //bytes~얼마나 정보가 전달이 되었는지 알려준다,
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPercentage(Math.round(progress));
          // console.log('percentage', percentage);
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              console.log('Upload is not working');
          }
        },
        (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
            case 'storage/unknown':
              break;
            default:
              // eslint-disable-next-line no-unused-expressions
              'storage/retry-limit-exceeded';
          }
        },
        //저장한 storage 이후에, storage에 저장된 정보를 메세지 테이블(messageRef)에 저장한다.
        //지금까지 이미지를 storage에 저장했는데, 이 저장된 이미지의 정보를 메세지 테이블에 저장한다
        //이전에 메세지 테이블(messageRef)에 텍스트 정보가 저장됐는데, 이미지가 저장되면 content 객체안에 이미지 url이 들어간다.
        //createMessage 메세지 안에 객체에 정보가 들어간다
        //우리가 storage에 저장한 이미지를 보려면 url이 필요하다
        //url을 갖기 위해서
        //저장이 모두 된 후에 파일 메세지를 데이터 베이스에 저장함
        //저장된 파일을 다운로드 받을 수 있는 url을 가져오는 방법 = (uploadTask.snapshot.ref)
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log('downloadURL', downloadURL);
            set(
              //messageRef는 메세지 테이블임
              //메세지 테이블에 저장하는 로직
              //chatRoom.id는 첫번째방, 두번째방,세번째 방의 id를 의미함
              push(child(messagesRef, chatRoom.id)),
              // 메세지 테이블에 들어가기 위한 객체를 만들어주는 createMessage 함수
              createMessage(downloadURL)
            );
            setLoading(false);
          });
        }
      );
    } catch (error) {
      console.log('이미지를 업로드 중에 에러가 발생했습니다.', error);
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
      {/* <ProgressBar
        variant="warning"
        label={`${pregress}%`}
        now={progress}
      /> */}
      {/* {console.log('percentage', percentage)} */}
      {/* {console.log(percentage === 0 || percentage === 100)} */}

      {!(percentage === 0 || percentage === 100) && (
        <ProgressBar
          variant="warning"
          label={`${percentage}%`}
          now={percentage}
        />
      )}

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
            onClick={handleOpenImageRef}
            className="message-form-button"
            style={{ width: '100%' }}
            // disabled={loading ? true : false}
          >
            UPLOAD
          </button>
        </Col>
      </Row>
      <input
        type="file"
        accept="image/jpeg, image/png"
        style={{ display: 'none' }}
        ref={inputOpenImageRef}
        onChange={handleUploadImage}
      />
    </div>
  );
}

export default MessageForm;
