import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login';
import ChatApp from './chatApp';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat/:roomId" element={<ChatApp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

