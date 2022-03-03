import React from 'react';
import UserPanel from './UserPanel';
import Favorite from './Favorite';
import ChatRoom from './ChatRoom';
import DirectMessages from './DirectMessages';

function SidePanel() {
  return (
    <div
      style={{
        backgroundColor: '#7b83eb',
        padding: '2rem',
        minHeight: '100vh',
        color: 'white',
        minWidth: '275px',
      }}
    >
      <UserPanel />
      <Favorite />
      <ChatRoom />
      <DirectMessages />
    </div>
  );
}

export default SidePanel;
