import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

const AuthPage = () => {
  const [username, setUsername] = useState(null);
  const [userImg, setUserImg] = useState(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    // Додайте код для авторизації через Google або GitHub тут
    // Після успішної авторизації використайте history.push('/empty-page') для переходу на порожню сторінку
  };

  useEffect(() => {
    localStorage.setItem('userName', username);
    localStorage.setItem('userImg', userImg);
  }, [username, userImg]);

  return (
    <div className="auth-container">
      <div className="centered-content">
        <h1>Авторизація</h1>
        <div className='google'>
            <GoogleLogin
             style={{ backgroundColor: '#fff', color: '#000', border: '1px solid #000' }}
            onSuccess={(credentialResponse) => {
                const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
                setUsername(credentialResponseDecoded.given_name);
                setUserImg(credentialResponseDecoded.picture);
                if (localStorage.getItem('userName') !== null) {
                setTimeout(() => {
                    navigate('/main-page');
                }, 2000);
                }
            }}
            onError={() => {
                console.log('Login Failed');
            }}
            />
        </div>
     
        <button className="login-button" onClick={handleLogin}>
          Увійти через Google або GitHub
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
