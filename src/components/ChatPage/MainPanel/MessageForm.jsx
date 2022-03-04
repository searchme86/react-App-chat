import React from 'react';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import firebase from '../../../firebase';
// import { useSelector } from 'react-redux';
// import mime from 'mime-types';
// import { getDatabase, ref, set, remove, push, child } from 'firebase/database';
// import {
//   getStorage,
//   ref as strRef,
//   uploadBytesResumable,
//   getDownloadURL,
// } from 'firebase/storage';

function MessageForm() {
  return (
    <div>
      <Form>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Control
            // onKeyDown={handleKeyDown}
            // value={content}
            // onChange={handleChange}
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
        {/* {errors.map((errorMsg) => (
          <p style={{ color: 'red' }} key={errorMsg}>
            {errorMsg}
          </p>
        ))} */}
      </div>

      <Row>
        <Col>
          <button
            // onClick={handleSubmit}
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
