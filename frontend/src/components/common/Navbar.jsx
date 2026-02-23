import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="absolute w-full z-10 p-5 flex justify-between items-center bg-transparent text-white">
      <Link to="/" className="no-underline text-white">
        <h2 className="text-2xl font-extrabold m-0 cursor-pointer">
          TOWN<span className="text-rose-500">TASK</span>
        </h2>
      </Link>

      <div className="flex items-center space-x-6">
        {token ? (
          <>
            {/* Show different links based on role */}
            <Link to="/dashboard" className="hover:text-rose-300 font-medium no-underline text-white">
              Dashboard
            </Link>
            
            <Link to="/volunteer-dashboard" className="text-rose-500 font-bold no-underline">
              📡 Radar
            </Link>

            <button 
              onClick={handleLogout}
              className="border-2 border-rose-500 px-4 py-1 rounded-md hover:bg-rose-500 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-white no-underline font-medium hover:text-rose-300">
              Log In
            </Link>
            <Link 
              to="/register" 
              className="text-white no-underline border-2 border-white px-5 py-2 rounded-md hover:bg-white hover:text-rose-500 transition duration-300"
            >
              Join TownTask
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;