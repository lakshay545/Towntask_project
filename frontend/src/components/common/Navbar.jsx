import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="absolute w-full z-10 p-5 flex justify-between items-center bg-transparent text-white">
      <h2 className="text-2xl font-extrabold m-0">
        TOWN<span className="text-rose-500">TASK</span>
      </h2>
      <div className="flex items-center space-x-6">
        <Link to="/auth" className="text-white no-underline font-medium hover:text-rose-300">
          Log In
        </Link>
        <Link 
          to="/auth" 
          className="text-white no-underline border-2 border-white px-5 py-2 rounded-md hover:bg-white hover:text-rose-500 transition duration-300"
        >
          Post a Project
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
