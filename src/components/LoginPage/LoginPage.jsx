import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { app } from '../../Firebase.js';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorFromSubmit, setErrorFromSubmit] = useState('');

  const onSubmit = async (data) => {
    console.log('react-hook-form의 값', data);

    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      setErrorFromSubmit(error.message);
      setTimeout(() => {
        setErrorFromSubmit('');
      }, 5000);
    }
  };

  return (
    <div className="auth-wrapper">
      <div style={{ textAlign: 'center' }}>
        <h3>Login</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          {...register('email', {
            required: true,
            pattern: /^\S+@\S+$/i,
          })}
          placeholder="email을 입력해주세요"
        />
        {errors.email && <p>this field is required</p>}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          {...register('password', { required: true, minLength: 6 })}
          placeholder="password를 입력해주세요"
        />
        {errors.password && errors.password.type === 'required' && (
          <p>this name field is required</p>
        )}
        {errors.password && errors.password.type === 'minLength' && (
          <p>this name field is required</p>
        )}

        {errorFromSubmit && <p>{errorFromSubmit}</p>}
        <input type="submit" />
      </form>

      <Link
        style={{ color: 'gray', textDecoration: 'none', textAlign: 'left' }}
        to="/register"
      >
        아직 아이디가 없다면...
      </Link>
    </div>
  );
}

export default LoginPage;
