import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const FullVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const handleDigiLockerSync = async () => {
    setIsVerifying(true);
    const token = localStorage.getItem('token');

    // In a real app, this is where you'd open the DigiLocker OAuth Popup
    // For now, we simulate the 'Success' callback from the API
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-volunteer', {
        provider: 'DIGILOCKER',
        status: 'SUCCESS',
        // In reality, the API returns a 'Token' or 'Masked ID'
        mockData: { aadhaar: '123456789012', pan: 'ABCDE1234F' } 
      }, {
        headers: { 'x-auth-token': token }
      });

      if (response.status === 200) {
        alert("DigiLocker Verified! You are now a TownTask Hero.");
        navigate('/dashboard');
      }
    } catch (err) {
      alert("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div style={containerStyle}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={cardStyle}>
        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏛️</div>
        <h2 style={{ marginBottom: '10px' }}>Government ID Sync</h2>
        <p style={{ color: '#888', marginBottom: '30px' }}>
          TownTask uses <strong>DigiLocker</strong> to verify your identity. 
          We never store your raw Aadhaar or PAN numbers.
        </p>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          onClick={handleDigiLockerSync}
          style={digiBtn}
          disabled={isVerifying}
        >
          {isVerifying ? "Connecting to DigiLocker..." : "AUTHORIZE VIA DIGILOCKER"}
        </motion.button>

        <p style={{ fontSize: '0.8rem', color: '#555', marginTop: '20px' }}>
          By clicking, you agree to share your Aadhaar/PAN metadata for community safety.
        </p>
      </motion.div>
    </div>
  );
};

// --- STYLES ---
const containerStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', color: '#fff', padding: '20px' };
const cardStyle = { background: '#111', padding: '50px 30px', borderRadius: '25px', border: '1px solid #222', maxWidth: '420px', textAlign: 'center' };
const digiBtn = { padding: '18px', width: '100%', background: '#0056b3', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' };

export default FullVerification;