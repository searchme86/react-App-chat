import { combineReducers } from 'redux';
import User from './user_reducer';
import chatRoom from './chatRoom_reducer';

const rootReducer = combineReducers({
  user: User,
  chatRoom,
});

export default rootReducer;
