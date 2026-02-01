import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Towntask</h1>
      <p className="text-xl text-gray-600">Your local skill & work matching platform</p>
      <div className="mt-8">
        <a href="/auth" className="px-6 py-3 bg-indigo-600 text-white rounded-md text-lg hover:bg-indigo-700">Get Started</a>
      </div>
    </div>
  );
};

export default HomePage;
