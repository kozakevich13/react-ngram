// MainPage.jsx

import React, { useState, useEffect } from "react";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import axios from "axios";
import "./MainPage.css"; // Import the CSS file for styling

const MainPage = () => {
  const [responseData, setResponseData] = useState(null);
  const [largeTextInput, setLargeTextInput] = useState("");
  const [singleWordInput, setSingleWordInput] = useState("");
  const [numWordsInput, setNumWordsInput] = useState(6);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bigramDict, setBigramDict] = useState(null);
  const [selectedNGramType, setSelectedNGramType] = useState("bigram");
  const userName = localStorage.getItem("userName");
  const userImg = localStorage.getItem("userImg");
  const navigate = useNavigate();

  const logOut = () => {
    googleLogout();
    localStorage.setItem("userName", "empty");
    localStorage.setItem("userImg", "empty");
    navigate("/");
  };

  const sendTextToServer = async (text) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/", { text });
      console.log(text);
      console.log(response.data);
      setResponseData(response.data);
    } catch (error) {
      console.error("Error sending text to server:", error);
    }
  };

  const sendOneWordToServer = async (text) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/word", { text });
      console.log(text);
      console.log(response.data);
      setResponseData(response.data);
    } catch (error) {
      console.error("Error sending text to server:", error);
    }
  };

  const generateData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/generation?seed_word=${singleWordInput}&num_words=${numWordsInput}&n_gram_type=${selectedNGramType}`
      );
      console.log(response.data);
      setResponseData(response.data);
    } catch (error) {
      console.error("Error generating data:", error);
    }
  };

  const handleClearText = async () => {
    try {
      setLoading(true);
      const response = await axios.delete("http://localhost:5000/delete_text");
      console.log(response.data);
    } catch (error) {
      console.error("Error clearing text:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetBigramDict = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/n-grams?type=${selectedNGramType}`
      );
      console.log(response.data);
      setBigramDict(response.data.n_gram_dict);
    } catch (error) {
      console.error("Error getting bigram dictionary:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bigramDict) {
      console.log("Bigram Dictionary:", bigramDict);
      // Виведення словника біграм в консоль або обробка даних за вашими потребами
    }
  }, [bigramDict]);

  const handleSelectChange = (event) => {
    setSelectedNGramType(event.target.value);
  };
  console.log(selectedNGramType);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:5000/upload-fiel", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Handle success or error
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error
      });
  };

  return (
    <div className="main-container">
      <div className="header">
        <div>
          <Typography variant="h5">
            Генератор текстових повідомлень заданої семантичної спрямованості{" "}
          </Typography>
          <Typography variant="h5">
            {" "}
            з використанням лексичних n-грам
          </Typography>
        </div>

        <div className="user-info">
          <Typography style={{ marginRight: "10px" }} variant="h5">
            Доброго дня, {userName}!
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar alt={userName} src={userImg} />
            <Button variant="outlined" onClick={logOut}>
              Log Out
            </Button>
          </Stack>
        </div>
      </div>
      <div className="main-block">
        <div className="first-block">
          <Typography variant="h5">Навчання моделі</Typography>

          <div>
            <input type="file" onChange={handleFileChange} />
            <Button
              style={{ width: "20%" }}
              variant="outlined"
              onClick={handleUpload}
            >
              Upload File
            </Button>
          </div>

          <Button style={{ width: "20%" }} variant="outlined" onClick={logOut}>
            Переглянути токенізований текст
          </Button>

          <TextField
            id="outlined-multiline-static"
            label="Введіть багаторядковий текст"
            multiline
            rows={5}
            value={largeTextInput}
            onChange={(e) => setLargeTextInput(e.target.value)}
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#888" } }}
            style={{ marginTop: "10px", marginRight: "10px" }}
          />

          <div className="button-container">
            <Button
              variant="contained"
              onClick={() => sendTextToServer(largeTextInput)}
            >
              Відправити багаторядковий текст
            </Button>

            <Button
              onClick={handleClearText}
              disabled={loading}
              style={{ backgroundColor: "#75201a", color: "white" }}
            >
              {loading ? "Очистка..." : "Очистити історію навчання"}
            </Button>

            <Button
              onClick={handleGetBigramDict}
              disabled={loading}
              variant="contained"
            >
              {loading ? "Отримання словника..." : "Словник"}
            </Button>
            <div>
              <label>Виберіть тип N-грам</label>
              <select value={selectedNGramType} onChange={handleSelectChange}>
                <option value="bigram">Bigram</option>
                <option value="trigram">Trigram</option>
              </select>
            </div>
          </div>

          <Typography variant="h6">Словник:</Typography>

          {bigramDict && (
            <div
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                border: "1px solid #ccc",
                padding: "10px",
              }}
            >
              <Typography variant="h6">Словник:</Typography>
              <pre>{JSON.stringify(bigramDict, null, 2)}</pre>
            </div>
          )}
        </div>
        <div className="second-block">
          <Typography variant="h5">Генерація текстових повідомленнь</Typography>
          <Typography variant="h6">Шаблон семантичної спрямованості</Typography>

          <TextField
            id="outlined-basic"
            label="Введіть одне слово"
            value={singleWordInput}
            onChange={(e) => setSingleWordInput(e.target.value)}
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#888" } }}
            style={{ marginTop: "10px" }}
          />

          <TextField
            id="outlined-basic"
            label="Кількість слів"
            type="number"
            value={numWordsInput}
            onChange={(e) => setNumWordsInput(e.target.value)}
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#888" } }}
            style={{ marginTop: "10px" }}
          />

          <Button
            variant="contained"
            onClick={generateData}
            style={{ backgroundColor: "#4CAF50", color: "white" }}
          >
            Генерація
          </Button>

          {responseData && (
            <div>
              <Typography variant="h6">Згенероване повідомлення:</Typography>
              <pre>{JSON.stringify(responseData.message)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
