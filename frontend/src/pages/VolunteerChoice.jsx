import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const VolunteerChoice = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleDecision = async (choice) => {
    if (isLoading) return; // Prevent multiple clicks
    setIsLoading(true);

    const token = localStorage.getItem('token');
    
    if (choice === 'YES') {
      // User opted-in, send them to the verification upload page
      navigate('/full-verification'); 
    } else {
      try {
        // Notifies backend that user skipped, then moves to dashboard
        // We use a timeout or try/catch so the user isn't stuck if the server is down (Error 500/404)
        await axios.post('http://localhost:5000/api/auth/skip-volunteer', {}, {
          headers: { 'x-auth-token': token }
        });
      } catch (err) {
        console.error("Server sync failed, proceeding to dashboard:", err);
      } finally {
        // Always navigate to dashboard even if backend call fails
        navigate('/dashboard');
      }
    }
  };

  return (
    <div style={containerStyle}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={cardStyle}
      >
        <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>🛡️</div>
        
        <h1 style={{ color: '#fff', fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-1px' }}>
          Be a <span style={{ color: '#f50057' }}>Community Hero</span>
        </h1>
        
        <p style={{ color: '#aaa', margin: '20px 0', lineHeight: '1.7', fontSize: '1.05rem' }}>
          Would you like to join our elite squad of <strong>Emergency Volunteers</strong>? <br />
          Verified heroes receive a <span style={{ color: '#f50057' }}>special badge</span>, 
          higher trust scores, and priority visibility on high-paying tasks.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
          <motion.button 
            whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(245, 0, 87, 0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleDecision('YES')} 
            disabled={isLoading}
            style={{ ...yesBtn, opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Processing...' : "YES, I'M IN"}
          </motion.button>

          <motion.button 
            whileHover={{ color: '#fff' }}
            onClick={() => handleDecision('SKIP')} 
            disabled={isLoading}
            style={skipBtn}
          >
            Maybe later, take me to Dashboard
          </motion.button>
        </div>
        
        <p style={{ fontSize: '0.8rem', color: '#444', marginTop: '20px' }}>
          *Verification requires a valid Government ID.
        </p>
      </motion.div>
    </div>
  );
};

// --- STYLES ---

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'radial-gradient(circle at center, #111 0%, #000 100%)',
  padding: '20px',
  fontFamily: "'Sora', sans-serif"
};

const cardStyle = { 
  background: 'rgba(17, 17, 17, 0.8)', 
  padding: '50px 40px', 
  borderRadius: '24px', 
  border: '1px solid rgba(245, 0, 87, 0.1)', 
  maxWidth: '480px', 
  textAlign: 'center',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
};

const yesBtn = { 
  padding: '18px', 
  background: '#f50057', 
  color: '#fff', 
  border: 'none', 
  borderRadius: '12px', 
  cursor: 'pointer', 
  fontWeight: '800',
  fontSize: '1.1rem',
  letterSpacing: '1px',
  transition: 'all 0.3s ease'
};

const skipBtn = { 
  padding: '10px', 
  background: 'transparent', 
  color: '#666', 
  border: 'none', 
  borderRadius: '5px', 
  cursor: 'pointer',
  fontSize: '0.95rem',
  textDecoration: 'none',
  transition: 'color 0.2s ease'
};

export default VolunteerChoice;