import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthPage = ({ history }) => {
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

    console.log(username);
    console.log(userImg);

    return (
        <div>
            <h1>Авторизація</h1>
            <GoogleLogin
                onSuccess={credentialResponse => {
                    console.log(credentialResponse);
                    const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
                    setUsername(credentialResponseDecoded.given_name);
                    setUserImg(credentialResponseDecoded.picture);
                    if(localStorage.getItem("userName") !== null) {
                        console.log('умова пройшла')
                        setTimeout(() => {
                            navigate("/main-page");
                            
                            }, 2000)
                        }}
                        
                    }
              
                onError={() => {
                    console.log('Login Failed');
                }}
            />
            <button onClick={handleLogin}>Увійти через Google або GitHub</button>
        </div>
    );
};

export default AuthPage;
