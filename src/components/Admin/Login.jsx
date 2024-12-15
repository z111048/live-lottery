// src/components/Admin/Login.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';
import Error from '../common/Error';

const Login = ({ onSubmit, isConnected, error }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token.trim()) return;
    onSubmit(token);
  };

  return (
    <div className='login-section'>
      <h2>管理員登入</h2>
      <form onSubmit={handleSubmit} className='login-form'>
        <input
          type='password'
          id='adminPassword'
          name='adminPassword'
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder='請輸入管理員密碼'
          className='password-input'
          autoComplete='current-password'
        />
        <Button type='submit' disabled={!isConnected} variant='primary' className='login-button'>
          登入
        </Button>
      </form>
      {error && <Error message={error} />}
    </div>
  );
};

Login.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isConnected: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default Login;
