import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion'; // Added for animations

const VolunteerChoice = () => {
  const navigate = useNavigate();

  const handleDecision = async (choice) => {
    const token = localStorage.getItem('token');
    
    if (choice === 'YES') {
      // Directs to your KYC/Verification flow
      navigate('/full-verification'); 
    } else {
      try {
        // Notifies backend that user skipped, then moves to dashboard
        await axios.post('http://localhost:5000/api/auth/skip-volunteer', {}, {
          headers: { 'x-auth-token': token }
        });
        navigate('/dashboard');
      } catch (err) {
        // Even if the API fails, we don't want to lock the user out of their dashboard
        console.error("Skip failed:", err);
        navigate('/dashboard');
      }
    }
  };

  return (
    <div style={containerStyle}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={cardStyle}
      >
        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🛡️</div>
        <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: '900' }}>
          Be a <span style={{ color: '#f50057' }}>Community Hero</span>
        </h1>
        <p style={{ color: '#aaa', margin: '20px 0', lineHeight: '1.6' }}>
          Would you like to become a Community Emergency Volunteer? <br />
          <strong>Verified volunteers</strong> get higher trust scores and priority visibility on tasks.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleDecision('YES')} 
            style={yesBtn}
          >
            YES, I'M IN
          </motion.button>

          <motion.button 
            whileHover={{ color: '#fff' }}
            onClick={() => handleDecision('SKIP')} 
            style={skipBtn}
          >
            Maybe later, take me to Dashboard
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// --- STYLES (Fixed the missing containerStyle) ---

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#000', // Matches the app theme
  padding: '20px'
};

const cardStyle = { 
  background: '#111', 
  padding: '50px 40px', 
  borderRadius: '20px', 
  border: '1px solid #222', 
  maxWidth: '450px', 
  textAlign: 'center',
  boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
};

const yesBtn = { 
  padding: '16px', 
  background: '#f50057', // Using your brand pink
  color: '#fff', 
  border: 'none', 
  borderRadius: '8px', 
  cursor: 'pointer', 
  fontWeight: 'bold',
  fontSize: '1rem',
  letterSpacing: '1px'
};

const skipBtn = { 
  padding: '10px', 
  background: 'transparent', 
  color: '#666', 
  border: 'none', 
  borderRadius: '5px', 
  cursor: 'pointer',
  fontSize: '0.9rem',
  textDecoration: 'underline'
};

export default VolunteerChoice;