import React from 'react';
import moment from 'moment';

function Message({ message, user }) {
  const timeFromNow = (timestamp) => moment(timestamp).fromNow();
  //이미지가 들어올 수도 있고 텍스트가 들어올 수 있어서 분기처리해야함
  //isImages는 확실히 이미지다.
  const isImage = (message) => {
    return (
      message.hasOwnProperty('image') && !message.hasOwnProperty('content')
    );
  };
  const isMessageMine = (message, user) => {
    if (user) {
      return message.user.id === user.uid;
    }
  };
  console.log('Message 컴포넌트의 message', message);
  console.log('Message 컴포넌트의 user', user);

  return (
    <div style={{ marginBottom: '3px', display: 'flex' }}>
      <img
        style={{ borderRadius: '10px' }}
        width={48}
        height={48}
        className="mr-3"
        src={message.user.image}
        alt={message.user.name}
      />
      <div
        style={{
          backgroundColor: isMessageMine(message, user) && '#ECECEC',
        }}
      >
        <h6>
          {message.user.name}{' '}
          <span style={{ fontSize: '10px', color: 'gray' }}>
            {timeFromNow(message.timestamp)}
          </span>
        </h6>
        {isImage(message) ? (
          <img style={{ maxWidth: '300px' }} alt="이미지" src={message.image} />
        ) : (
          <p>{message.content}</p>
        )}
      </div>
    </div>
  );
}

export default Message;
