import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-900 flex flex-col justify-center items-center">
      <h1 className="text-8xl font-bold text-white neon-text">404</h1>
      <p className="text-lg text-gray-300 mt-4 fade-in-text">Page not found</p>
      <button
        className="bg-indigo-600 hover:bg-indigo-800 text-white py-3 px-6 rounded-lg mt-6 neon-button pulse-effect"
        onClick={() => (window.location.href = '/')}
      >
        Go Home
      </button>

      {/* Adding the futuristic animations */}
      <style>{`
        /* Neon Text Effect */
        .neon-text {
          text-shadow: 0 0 20px rgba(138, 43, 226, 0.8), 0 0 30px rgba(75, 0, 130, 0.8);
          animation: neon-flicker 1.5s infinite alternate;
        }

        @keyframes neon-flicker {
          0% {
            opacity: 0.8;
            text-shadow: 0 0 5px rgba(138, 43, 226, 0.5), 0 0 10px rgba(75, 0, 130, 0.5);
          }
          50% {
            opacity: 1;
            text-shadow: 0 0 20px rgba(138, 43, 226, 0.8), 0 0 30px rgba(75, 0, 130, 0.8);
          }
          100% {
            opacity: 0.9;
            text-shadow: 0 0 10px rgba(138, 43, 226, 0.7), 0 0 15px rgba(75, 0, 130, 0.7);
          }
        }

        /* Fade In Text Animation */
        .fade-in-text {
          animation: fadeIn 2s ease-in-out forwards;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Pulse Effect for the Button */
        .pulse-effect {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 15px rgba(75, 0, 130, 0.5);
          }
          50% {
            box-shadow: 0 0 30px rgba(138, 43, 226, 0.7);
          }
        }

        /* Button Neon Effect */
        .neon-button {
          box-shadow: 0 0 15px rgba(138, 43, 226, 0.6), 0 0 25px rgba(75, 0, 130, 0.5);
          transition: all 0.3s ease-in-out;
        }

        .neon-button:hover {
          box-shadow: 0 0 25px rgba(138, 43, 226, 0.9), 0 0 40px rgba(75, 0, 130, 0.7);
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
