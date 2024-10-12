

import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 flex flex-col justify-center items-center">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
        Welcome to Varta
      </h1>
      <p className="text-lg md:text-2xl text-white mb-8">
        Chat with random people anonymously!
      </p>
      <button
        className="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-lg hover:bg-indigo-100 transition duration-300"
        onClick={() => navigate('/chat')}
      >
        Start Chatting
      </button>
    </div>
  );
};

export default LandingPage;
