import React, { useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import axios from 'axios';

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
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h3">Головна сторінка</Typography>
                <Typography variant="h5">Доброго дня, {userName}!</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar alt={userName} src={userImg} />
                    <Button variant="outlined" onClick={logOut}>
                        Log Out
                    </Button>
                </Stack>
            </div>

            {/* Велике поле для введення тексту */}
            <TextField
                id="outlined-multiline-static"
                label="Введіть багаторядковий текст"
                multiline
                rows={4}
                value={largeTextInput}
                onChange={(e) => setLargeTextInput(e.target.value)}
            />

            {/* Поле для введення одного слова */}
            <TextField
                id="outlined-basic"
                label="Введіть одне слово"
                value={singleWordInput}
                onChange={(e) => setSingleWordInput(e.target.value)}
            />

            <TextField
                id="outlined-basic"
                label="Кількість слів"
                type="number"
                value={numWordsInput}
                onChange={(e) => setNumWordsInput(e.target.value)}
            />

            {/* Кнопки для відправлення текстів та генерації */}
            <Button variant="contained" onClick={() => sendTextToServer(largeTextInput)}>
                Відправити багаторядковий текст
            </Button>

            <Button variant="contained" onClick={() => sendOneWordToServer(singleWordInput)}>
                Відправити одне слово
            </Button>

            <Button variant="contained" onClick={generateData}>
                Генерація
            </Button>

            {/* Відображення інформації з отриманого запиту */}
            {responseData && (
                <div>
                    <Typography variant="h6">Отримана інформація:</Typography>
                    <pre>{JSON.stringify(responseData.message)}</pre>
                </div>
            )}
        </div>
    );
};

export default MainPage;
