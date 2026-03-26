import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [unreadCount, setUnreadCount] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user role from localStorage or context
    const role = localStorage.getItem('selectedRole') || 'worker';
    setUserRole(role);
    
    // Simulate loading data
    setTimeout(() => {
      setProfileCompletion(75);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">TownTask</h1>
            <p className="text-sm text-gray-600">
              {userRole === 'worker' ? 'Worker' : 'Poster'} Dashboard
            </p>
          </div>
          <div className="flex items-center gap-6">
            {/* Notifications */}
            <button className="relative">
              <span className="text-2xl">💬</span>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {/* Profile Menu */}
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              <span className="text-2xl">👤</span>
              <span className="text-sm font-medium">Profile</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8 shadow-lg">
              <h2 className="text-3xl font-bold mb-2">
                {userRole === 'worker' ? 'Welcome back, Worker! 👋' : 'Welcome back, Poster! 👋'}
              </h2>
              <p className="text-blue-100 mb-4">
                {userRole === 'worker'
                  ? 'Browse new opportunities and build your reputation'
                  : 'Post tasks and connect with skilled workers'}
              </p>
              <button
                onClick={() =>
                  userRole === 'worker'
                    ? navigate('/jobs')
                    : navigate('/jobs/post')
                }
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                {userRole === 'worker' ? 'Browse Jobs' : 'Post a Task'}
              </button>
            </div>

            {/* Job Feed for Workers */}
            {userRole === 'worker' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Jobs Near You</h3>
                <div className="space-y-4">
                  {/* Sample Job Card */}
                  <div className="border-l-4 border-blue-500 p-4 bg-gray-50 rounded hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-800">Website Redesign</h4>
                        <p className="text-sm text-gray-600">Posted 2 hours ago in Your City</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        $500
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">
                      Need a professional redesign for my small business website using React...
                    </p>
                    <div className="flex gap-2 flex-wrap mb-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">React</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Design</span>
                    </div>
                    <button className="text-blue-600 font-semibold hover:text-blue-700">
                      View Details & Bid →
                    </button>
                  </div>

                  {/* More jobs would go here */}
                </div>
                <button className="w-full mt-4 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded">
                  View All Available Jobs →
                </button>
              </div>
            )}

            {/* Posted Jobs for Posters */}
            {userRole === 'poster' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Your Posted Tasks</h3>
                <div className="space-y-4">
                  {/* Sample Posted Job */}
                  <div className="border-l-4 border-purple-500 p-4 bg-gray-50 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-800">House Cleaning - 3 Bedrooms</h4>
                        <p className="text-sm text-gray-600">5 proposals received</p>
                      </div>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        Open
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">Budget: $150 | Status: Finding workers</p>
                    <button className="text-purple-600 font-semibold hover:text-purple-700">
                      View Proposals →
                    </button>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded">
                  Post Another Task →
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Profile Progress */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-bold text-gray-800 mb-4">📊 Profile Progress</h4>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{profileCompletion}% Complete</span>
                  <span className="text-xs text-gray-500">Almost there!</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
              </div>
              <button className="w-full mt-4 py-2 px-4 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100">
                Complete Profile
              </button>
            </div>

            {/* Task Checklist */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h4 className="font-bold text-gray-800 mb-4">✓ To-Do</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm text-gray-700 line-through">Add profile photo</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span className="text-sm text-gray-700">Verify identity</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span className="text-sm text-gray-700">Add payment method</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm text-gray-700 line-through">Verify address</span>
                </label>
              </div>
            </div>

            {/* Platform Tips */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border-l-4 border-yellow-500">
              <h4 className="font-bold text-gray-800 mb-3">💡 Pro Tip</h4>
              <p className="text-sm text-gray-700 mb-3">
                Complete your profile to increase your visibility and get more job opportunities.
              </p>
              <button className="text-sm text-yellow-700 font-semibold hover:underline">
                Learn more →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
