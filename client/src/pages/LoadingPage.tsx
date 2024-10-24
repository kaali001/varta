import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle transition animation before navigating to the chat page
  const handleStartChatting = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/chat');
    }, 3000); // 3 seconds for animation
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Optional Background Image */}
      <div className="absolute inset-0 bg-cover bg-center opacity-50 filter blur-md">
        {/* Insert background image here, if needed */}
      </div>

      {/* Main Content - Welcome Message & Start Button */}
      <div
        className={`transition-all duration-1000 ease-out ${
          isTransitioning ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'
        }`}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-shadow">
          Welcome to Varta
        </h1>
        <p className="text-lg md:text-2xl text-white mb-8 text-shadow">
          Chat with random people anonymously!
        </p>
        <button
          className="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-lg hover:bg-indigo-100 transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          onClick={handleStartChatting}
        >
          Start Chatting
        </button>
      </div>

      {/* Futuristic Animation on Start Button Click */}
      {isTransitioning && (
        <div className="absolute inset-0 flex justify-center items-center bg-gradient-to-r from-purple-700 to-indigo-800 z-50">
          <div className="relative w-64 h-64 animate-pulse">
            {/* Simulated Video Chat Bubbles */}
            <div className="absolute inset-0 bg-gradient-to-r from-white to-purple-500 rounded-full filter blur-2xl opacity-75"></div>
            <div className="relative bg-white w-full h-full rounded-full p-4 flex items-center justify-center shadow-xl">
              <div className="flex space-x-2">
                {/* Left Avatar */}
                <div className="w-14 h-14 bg-indigo-500 rounded-full flex justify-center items-center relative">
                  <span className="block w-3 h-3 bg-green-400 rounded-full absolute bottom-0 right-0"></span>
                </div>
                {/* Middle (speaking) Avatar */}
                <div className="w-20 h-20 bg-purple-500 rounded-full flex justify-center items-center relative">
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 animate-ping"></div>
                  <span className="block w-3 h-3 bg-green-400 rounded-full absolute bottom-0 right-0"></span>
                </div>
                {/* Right Avatar */}
                <div className="w-14 h-14 bg-indigo-500 rounded-full flex justify-center items-center relative">
                  <span className="block w-3 h-3 bg-green-400 rounded-full absolute bottom-0 right-0"></span>
                </div>
              </div>
            </div>
          </div>
          {/* Connecting Text Positioned at the Bottom */}
          <div className="absolute bottom-8 text-white text-lg">
            Connecting...
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
