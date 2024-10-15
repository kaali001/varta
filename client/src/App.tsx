// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LoadingPage';
import ChatPage from './pages/ChatPage';
import NotFoundPage from './pages/404';
import About from './pages/About';
import FAQ from './pages/FAQ';



const App: React.FC = () => {
  return (
    <Router>
      <Routes>

      <Route path="/" element={<LandingPage />} />
      <Route path="/About" element={<About />} />
      <Route path="/FAQ" element={<FAQ />} />
     
      
      <Route path="/chat" element={<ChatPage />} />
  
      <Route path="/*" element={<NotFoundPage/>} />
      
      </Routes>
    </Router>
  );
};

export default App;
