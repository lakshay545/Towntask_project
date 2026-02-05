import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

const Register = () => {
  const { role } = useParams(); // Gets 'client' or 'freelancer' from URL
 
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0f172a', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(15px)',
          padding: '40px',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.1)',
          width: '400px',
          textAlign: 'center'
        }}
      >
        <h2 style={{ color: '#fff', marginBottom: '10px' }}>
          Join as a <span style={{ color: '#818cf8', capitalize: 'true' }}>{role}</span>
        </h2>
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Create your TownTask account</p>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Full Name" style={inputStyle} />
          <input type="email" placeholder="Email Address" style={inputStyle} />
          <input type="password" placeholder="Password" style={inputStyle} />
          {role === 'freelancer' && (
            <input type="text" placeholder="Your Skills (e.g. Electrician, Designer)" style={inputStyle} />
          )}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={buttonStyle}
          >
            Create Account
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

const inputStyle = {
  padding: '12px 15px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)',
  color: '#fff',
  outline: 'none'
};

const buttonStyle = {
  padding: '14px',
  borderRadius: '12px',
  border: 'none',
  background: '#4f46e5',
  color: '#fff',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '10px'
};

export default Register;