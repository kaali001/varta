

import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-lg text-gray-600 mt-2">Page not found</p>
      <button
        className="bg-indigo-600 text-white py-2 px-4 rounded-lg mt-4"
        onClick={() => window.location.href = '/'}
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFoundPage;
