const SET_CURRENT_CHAT_ROOM = 'set_current_chat_room';
const SET_PRIVATE_CHAT_ROOM = 'set_private_chat_room';

export function setCurrentChatRoom(currentChatRoom) {
  return {
    type: SET_CURRENT_CHAT_ROOM,
    currentChatRoom: currentChatRoom,
  };
}

export function setPrivateChatRoom(isPrivate) {
  return {
    type: SET_PRIVATE_CHAT_ROOM,
    isPrivate: isPrivate,
  };
}

const initialChatRoomState = {
  currentChatRoom: null,
  isPrivate: false,
};

function User(state = initialChatRoomState, action) {
  switch (action.type) {
    case SET_CURRENT_CHAT_ROOM:
      return {
        ...state,
        currentChatRoom: action.currentChatRoom,
      };
    case SET_PRIVATE_CHAT_ROOM:
      return {
        ...state,
        isPrivate: action.isPrivate,
      };
    default:
      return state;
  }
}

export default User;
