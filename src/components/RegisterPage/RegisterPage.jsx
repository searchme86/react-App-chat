import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { app } from '../../Firebase.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import md5 from 'md5';
import { getDatabase, ref, child, set } from 'firebase/database';

function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [errorFromSubmit, setErrorFromSubmit] = useState('');

  const password = useRef();
  password.current = watch('password');

  const onSubmit = async (data) => {
    console.log('react-hook-form의 값', data);

    try {
      const auth = getAuth(app);
      let createdUser = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      console.log('생성된 createdUser', createdUser);

      await updateProfile(auth.currentUser, {
        displayName: data.name,
        photoURL: `http://gravatar.com/avatar/${md5(
          createdUser.user.email
        )}?d=identicon`,
      });

      const database = getDatabase();
      set(child(ref(database, `users`), createdUser.user.uid), {
        name: createdUser.user.displayName,
        image: createdUser.user.photoURL,
      });
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
        <h3>Register</h3>
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

        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          {...register('name', { required: true, maxLength: 10 })}
          placeholder="이름을 입력해주세요"
        />
        {errors.name && errors.name.type === 'required' && (
          <p>this field is required</p>
        )}
        {errors.name && errors.name.type === 'maxLength' && (
          <p>your input exceed maximum length</p>
        )}

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

        <label htmlFor="password_confirm">PasswordConfirm</label>
        <input
          type="passoword"
          id="password_confirm"
          {...register('password_confirm', {
            required: true,
            validate: (value) => value === password.current,
          })}
          placeholder="password를 다시한번 입력해주세요"
        />
        {errors.password_confirm &&
          errors.password_confirm.type === 'required' && (
            <p>this password field is required</p>
          )}
        {errors.password_confirm &&
          errors.password_confirm.type === 'validate' && (
            <p>the password do not match</p>
          )}

        {errorFromSubmit && <p>{errorFromSubmit}</p>}
        <input type="submit" />
      </form>

      <Link
        style={{ color: 'gray', textDecoration: 'none', textAlign: 'left' }}
        to="/login"
      >
        이미 아이디가 있다면...
      </Link>
    </div>
  );
}

export default RegisterPage;
