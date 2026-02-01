import React from 'react';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profile for ID: {id}</h1>
      <p className="text-lg text-gray-600">Details about the user profile will be displayed here.</p>
      {/* User profile content will go here */}
    </div>
  );
};

export default ProfilePage;
