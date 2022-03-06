import React from 'react';
import MainPanel from './MainPanel/MainPanel';
import SidePanel from './SidePanel/SidePanel';
import { useSelector } from 'react-redux';

function ChatPage() {
  const currentChatRoom = useSelector(
    (state) => state.chatRoom.currentChatRoom
  );
  const currentUser = useSelector((state) => state.user.currentUser);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '300px' }}>
        <SidePanel key={currentUser && currentUser.uid} />
      </div>
      <div style={{ width: '100%' }}>
        <MainPanel key={currentChatRoom && currentChatRoom.id} />
      </div>
    </div>
  );
}

export default ChatPage;
