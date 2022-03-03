import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ChatPage from './components/ChatPage/ChatPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import { app } from './Firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './redux/reducers/user_reducer';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      console.log('로그인된 user', user);
      if (user) {
        dispatch(setUser(user));
        navigate('/');
      } else {
        navigate('/login');
      }
    });
  }, [dispatch, navigate]);

  const { User } = useSelector((state) => state.User);
  console.log('User', User);

  return (
    <>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;
