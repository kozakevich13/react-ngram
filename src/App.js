// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import MainPage from './pages/MainPage';


const App = () => {
  return (
    <Router>
      <Routes >
        <Route path="/" exact element={<AuthPage/>} />
        <Route path="/main-page" element={<MainPage/>} />
      </Routes >
    </Router>
  );
};

export default App;
