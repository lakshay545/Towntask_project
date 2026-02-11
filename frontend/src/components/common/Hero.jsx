import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* BACKGROUND VIDEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-typing-on-her-laptop-2288-large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* OVERLAY FOR TEXT READABILITY */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

      {/* CONTENT */}
      <div className="relative z-20 flex flex-col justify-center h-full px-5 md:px-20 lg:px-40 max-w-4xl text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
          Hire the best experts <br /> for any task, online.
        </h1>
        
        <ul className="list-none p-0 text-lg md:text-xl mb-10">
          <li className="mb-3">✓ Local city-based experts</li>
          <li className="mb-3">✓ Save up to 50% & get quotes for free</li>
          <li>✓ Pay only when you're 100% happy</li>
        </ul>

        <div className="flex flex-col md:flex-row gap-4">
          <Link to="/auth">
            <button className="px-8 py-3 bg-rose-500 text-white font-bold rounded-md hover:bg-rose-600 transition duration-300 w-full md:w-auto">
              Hire a Freelancer
            </button>
          </Link>
          <Link to="/auth">
            <button className="px-8 py-3 bg-transparent text-white font-bold border-2 border-white rounded-md hover:bg-white hover:text-rose-500 transition duration-300 w-full md:w-auto">
              Earn Money Freelancing
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
