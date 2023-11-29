// MainPage.jsx

import React, { useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import './MainPage.css'; // Import the CSS file for styling

const MainPage = () => {
  const [responseData, setResponseData] = useState(null);
  const [largeTextInput, setLargeTextInput] = useState('');
  const [singleWordInput, setSingleWordInput] = useState('');
  const [numWordsInput, setNumWordsInput] = useState(6);
  const userName = localStorage.getItem('userName');
  const userImg = localStorage.getItem('userImg');
  const navigate = useNavigate();

  const logOut = () => {
    googleLogout();
    localStorage.setItem('userName', 'empty');
    localStorage.setItem('userImg', 'empty');
    navigate('/');
  };

  const sendTextToServer = async (text) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/', { text });
      console.log(text);
      console.log(response.data);
      setResponseData(response.data);
    } catch (error) {
      console.error('Error sending text to server:', error);
    }
  };

  const sendOneWordToServer = async (text) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/word', { text });
      console.log(text);
      console.log(response.data);
      setResponseData(response.data);
    } catch (error) {
      console.error('Error sending text to server:', error);
    }
  };

  const generateData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/generation?seed_word=${singleWordInput}&num_words=${numWordsInput}`);
      console.log(response.data);
      setResponseData(response.data);
    } catch (error) {
      console.error('Error generating data:', error);
    }
  };

  return (
    <div className="main-container">
      <div className="header">
        <Typography variant="h3">Головна сторінка</Typography>
        <div className="user-info">
          <Typography style={{ marginRight: '10px'}}  variant="h5">Доброго дня, {userName}!</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar alt={userName} src={userImg} />
            <Button variant="outlined" onClick={logOut}>
              Log Out
            </Button>
          </Stack>
        </div>
      </div>
      <div className='main-block'>
      <div className='first-block'>
        <TextField
            id="outlined-multiline-static"
            label="Введіть багаторядковий текст"
            multiline
            rows={20}
            value={largeTextInput}
            onChange={(e) => setLargeTextInput(e.target.value)}
            InputProps={{ style: { color: '#fff' } }}
            InputLabelProps={{ style: { color: '#888'  } }}
            style={{ marginTop: '10px'}} 
        />
    </div>
    <div className='second-block'>
        
      <TextField
        id="outlined-basic"
        label="Введіть одне слово"
        value={singleWordInput}
        onChange={(e) => setSingleWordInput(e.target.value)}
        InputProps={{ style: { color: '#fff' } }}
        InputLabelProps={{ style: { color: '#888' } }}
        style={{ marginTop: '10px' }}
      />

      <TextField
        id="outlined-basic"
        label="Кількість слів"
        type="number"
        value={numWordsInput}
        onChange={(e) => setNumWordsInput(e.target.value)}
        InputProps={{ style: { color: '#fff' } }}
        InputLabelProps={{ style: { color: '#888' } }}
        style={{ marginTop: '10px' }}
      />
        <div className="button-container">
        <Button variant="contained" onClick={() => sendTextToServer(largeTextInput)}>
          Відправити багаторядковий текст
        </Button>

        <Button variant="contained" onClick={() => sendOneWordToServer(singleWordInput)}>
          Відправити одне слово
        </Button>

        <Button
          variant="contained"
          onClick={generateData}
          style={{ backgroundColor: '#4CAF50', color: 'white' }}
        >
          Генерація
        </Button>

        
      </div>
      {responseData && (
        <div>
          <Typography variant="h6">Отримана інформація:</Typography>
          <pre>{JSON.stringify(responseData.message)}</pre>
        </div>
      )}
    </div>
      </div>
  


    

     
    </div>
  );
};

export default MainPage;
