import React from 'react';
import { useParams } from 'react-router-dom';

const JobDetailsPage = () => {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Job Details for Job ID: {id}</h1>
      <p className="text-lg text-gray-600">Details about the specific job will be displayed here.</p>
      {/* Job details content will go here */}
    </div>
  );
};

export default JobDetailsPage;
