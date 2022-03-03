const SET_USER = 'set_user';

export function setUser(user) {
  return {
    type: SET_USER,
    user: user,
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
    default:
      return state;
  }
}

export default User;
