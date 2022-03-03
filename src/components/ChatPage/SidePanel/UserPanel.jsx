import React, { useRef } from 'react';
import { IoIosChatboxes } from 'react-icons/io';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { useSelector } from 'react-redux';
import { app } from '../../../Firebase';
import { getAuth, updateProfile } from 'firebase/auth';
import { getDatabase, ref, update } from 'firebase/database';
//mime : npm i -D
import mime from 'mime';
import { useDispatch } from 'react-redux';
import { setPhotoURL } from '../../../redux/reducers/user_reducer';

import {
  getStorage,
  ref as strRef,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage';

function UserPanel() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const {
    currentUser: { photoURL, displayName, uid },
  } = useSelector((state) => state.user);

  const handleLogout = () => {
    const auth = getAuth(app);
    auth.signOut();
  };

  const inputOpenImageRef = useRef();
  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };

  const handleUploadImage = async (event) => {
    const file = event.target.files[0];
    const metadata = { contentType: mime.getType(file.name) };
    const storage = getStorage();

    try {
      //스토리지에 파일 선택해서 저장하기
      let uploadTask = uploadBytesResumable(
        strRef(storage, `user_image/${uid}`),
        file,
        metadata
      );
      //스토리지에 올린 파일을 확인하는 콘솔
      // console.log('uploadTask', uploadTask);
      //스토리지에 저장한 이미지의 이미지url을 받아서 내 프로필에 저장하는 로직
      //downloadURL은 실제 인터넷에서 볼수 있는 링크임
      await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('downloadURL', downloadURL);
        //새롭게 선택한 이미지를 내 프로필 이미지로 변경하는 리덕스관련 함수
        dispatch(setPhotoURL(downloadURL));
        //그 새롭게 선택한 이미지를 데이터 베이스에 저장하는 로직
        update(ref(getDatabase(), `users/${uid}`), { image: downloadURL });
      });
    } catch (error) {
      console.log('사진 파일을 올리는 중 발생한 에러입니다.', error);
    }
  };

  return (
    <div>
      <h3 style={{ color: 'white`' }}>
        <IoIosChatboxes /> Chat App
      </h3>
      <div style={{ display: 'flex', marginBottom: '1rem' }}>
        <Image
          src={currentUser && photoURL}
          style={{ width: '30px', height: '30px', marginTop: '3px' }}
          roundedCircle
        />
        <input
          type="file"
          accept="image/jpeg, image/png, image/svg"
          style={{ display: 'none' }}
          ref={inputOpenImageRef}
          onChange={handleUploadImage}
        />

        <Dropdown>
          <Dropdown.Toggle
            style={{ background: 'transparent', border: '0px' }}
            id="dropdown-basic"
          >
            {currentUser && displayName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleOpenImageRef}>
              프로필 사진 변경
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default UserPanel;
