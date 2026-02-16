import React, { useState } from 'react';
import axios from 'axios';

const SOSButton = () => {
  const [loading, setLoading] = useState(false);

  const handleSOS = () => {
    if (!window.confirm("ARE YOU SURE? This will alert all nearby verified volunteers.")) return;

    setLoading(true);

    // Step 1: Get GPS Location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { longitude, latitude } = position.coords;

        try {
          // Step 2: Send to Backend
          const token = localStorage.getItem('token'); // Get the JWT we set up
          const res = await axios.post(
            'http://localhost:5000/api/emergency/high',
            {
              category: 'Medical', // You can make this a dropdown later
              description: 'Emergency assistance needed at this location.',
              lng: longitude,
              lat: latitude
            },
            { headers: { 'x-auth-token': token } }
          );

          alert("SOS Broadcasted successfully!");
        } catch (err) {
          console.error(err.response?.data);
          alert(err.response?.data?.msg || "SOS Failed. Are you logged in?");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        alert("Please enable Location Services to use the SOS feature.");
        setLoading(false);
      }
    );
  };

  return (
    <button 
      onClick={handleSOS}
      disabled={loading}
      className={`sos-btn ${loading ? 'loading' : ''}`}
      style={{
        backgroundColor: 'red',
        color: 'white',
        padding: '20px 40px',
        borderRadius: '50%',
        fontWeight: 'bold',
        fontSize: '20px',
        border: '5px solid darkred',
        cursor: 'pointer',
        boxShadow: '0 0 15px rgba(255,0,0,0.5)'
      }}
    >
      {loading ? 'SENDING...' : 'HIGH EMERGENCY SOS'}
    </button>
  );
};

export default SOSButton;