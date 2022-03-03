const SET_USER = 'set_user';
const CLEAR_USER = 'clear_user';

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

const initialUserState = {
  currentUser: ' ',
  isLoading: true,
};

console.log('initialState', initialUserState);

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
    default:
      return state;
  }
}

export default User;
