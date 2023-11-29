import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

import backgroundVideo from '../media/video.mp4'; // Replace with the correct path

const AuthPage = () => {
  const [username, setUsername] = useState(null);
  const [userImg, setUserImg] = useState(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    // Add code for authorization through Google or GitHub here
    // After successful authorization, use history.push('/empty-page') to navigate to an empty page
  };

  useEffect(() => {
    localStorage.setItem('userName', username);
    localStorage.setItem('userImg', userImg);
  }, [username, userImg]);

  return (
    <div className="auth-container">
      <video className="video-background" autoPlay muted loop>
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

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
          Увійти через GitHub
        </button>
      </div>
    </div>
  )
}

export default AuthPage;
