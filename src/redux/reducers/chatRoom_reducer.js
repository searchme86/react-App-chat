const SET_CURRENT_CHAT_ROOM = 'set_current_chat_room';
const SET_PRIVATE_CHAT_ROOM = 'set_private_chat_room';
const SET_USER_POSTS = 'set_user_posts';

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

export function setUserPosts(userPosts) {
  return {
    type: SET_USER_POSTS,
    userPosts: userPosts,
  };
}

const initialChatRoomState = {
  currentChatRoom: null,
  isPrivate: false,
  userPosts: null,
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
    case SET_USER_POSTS:
      return {
        ...state,
        userPosts: action.userPosts,
      };
    default:
      return state;
  }
}

export default User;
