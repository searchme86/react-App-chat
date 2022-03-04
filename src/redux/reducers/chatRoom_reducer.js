const SET_CURRENT_CHAT_ROOM = 'set_current_chat_room';

export function setCurrentChatRoom(currentChatRoom) {
  return {
    type: SET_CURRENT_CHAT_ROOM,
    currentChatRoom: currentChatRoom,
  };
}

const initialChatRoomState = {
  currentChatRoom: null,
};

function User(state = initialChatRoomState, action) {
  switch (action.type) {
    case SET_CURRENT_CHAT_ROOM:
      return {
        ...state,
        currentChatRoom: action.currentChatRoom,
      };
    default:
      return state;
  }
}

export default User;
