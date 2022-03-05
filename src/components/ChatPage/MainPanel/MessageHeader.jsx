import React from 'react';
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
// import {
//   getDatabase,
//   ref,
//   onValue,
//   remove,
//   child,
//   update,
// } from 'firebase/database';

function MessageHeader({ handleSearchChange }) {
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
              <FaLockOpen style={{ marginBottom: '10px' }} />
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
