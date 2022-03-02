import React from 'react';
import { Link } from 'react-router-dom';

function RegisterPage() {
  return (
    <div className="auth-wrapper">
      <div style={{ textAlign: 'center' }}>
        <h3>Register</h3>
      </div>
      <form>
        <label>Email</label>
        <input type="email" name="email" placeholder="First name" />

        <label>Name</label>
        <input type="text" name="name" placeholder="First name" />

        <label>Password</label>
        <input type="password" name="password" placeholder="First name" />

        <label>PasswordConfirm</label>
        <input
          type="passoword"
          name="password_confirm"
          placeholder="First name"
        />

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
