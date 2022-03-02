import React from 'react';

function RegisterPage() {
  return (
    <div className="auth-wrapper">
      <form>
        <input placeholder="First name" />
        <select>
          <option value="">Select...</option>
          <option value="A">Option A</option>
          <option value="B">Option B</option>
        </select>
        <textarea placeholder="About you" />
        <input type="submit" />
      </form>
    </div>
  );
}

export default RegisterPage;
