const SET_USER = 'set_user';
const CLEAR_USER = 'clear_user';
const SET_PHOTO_URL = 'set_phto_url';

export function setUser(user) {
  return {
    type: SET_USER,
    user: user,
  };
}

export function clearUser() {
  return {
    type: CLEAR_USER,
  };
}

export function setPhotoURL(photoURL) {
  return {
    type: SET_PHOTO_URL,
    photoURL: photoURL,
  };
}

const initialUserState = {
  currentUser: ' ',
  isLoading: true,
};

function User(state = initialUserState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        currentUser: action.user,
        isLoading: false,
      };

    case CLEAR_USER:
      return {
        ...state,
        currentUser: '',
        isLoading: false,
      };

    case SET_PHOTO_URL:
      return {
        ...state,
        currentUser: { ...state.currentUser, photoURL: action.photoURL },
        isLoading: false,
      };

    default:
      return state;
  }
}

export default User;
