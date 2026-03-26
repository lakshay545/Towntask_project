import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // Save to localStorage or context
    localStorage.setItem('selectedRole', role);
    setTimeout(() => {
      if (role === 'poster') {
        navigate('/onboarding/poster-setup');
      } else {
        navigate('/onboarding/worker-setup');
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">TownTask</h1>
          <p className="text-xl text-gray-600">Choose your role to get started</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Poster Card */}
          <div
            onClick={() => handleRoleSelect('poster')}
            className={`cursor-pointer p-8 rounded-lg border-2 transition-all duration-300 ${
              selectedRole === 'poster'
                ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-md'
            }`}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">I Need Help</h2>
              <p className="text-gray-600 mb-4">Post tasks and hire skilled workers from your city</p>
              <ul className="text-left text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Post unlimited tasks
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Connect with local workers
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Secure payments
                </li>
              </ul>
            </div>
          </div>

          {/* Worker Card */}
          <div
            onClick={() => handleRoleSelect('worker')}
            className={`cursor-pointer p-8 rounded-lg border-2 transition-all duration-300 ${
              selectedRole === 'worker'
                ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                : 'border-gray-300 bg-white hover:border-green-400 hover:shadow-md'
            }`}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">💪</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">I Want to Work</h2>
              <p className="text-gray-600 mb-4">Offer your skills and earn money on your terms</p>
              <ul className="text-left text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Showcase your skills
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Earn competitive rates
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Work on your schedule
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
