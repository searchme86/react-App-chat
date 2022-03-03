import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ChatPage from './components/ChatPage/ChatPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import { app } from './Firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
  const nagivate = useNavigate();
  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      console.log('로그인된 user', user);
      if (user) {
        nagivate('/');
      } else {
        nagivate('/login');
      }
    });
  }, []);

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
