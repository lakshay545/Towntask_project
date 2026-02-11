import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Register = () => {
  const { role } = useParams(); // Gets 'client' or 'freelancer' from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        ...formData,
        role: role || 'client'
      });
      alert("Registration Successful!");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || "Registration Failed");
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#0a0a0a',
      padding: '20px'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: '450px',
          padding: '40px',
          borderRadius: '16px',
          backgroundColor: '#111',
          border: '1px solid rgba(245, 0, 87, 0.2)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}
      >
        <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '10px', textAlign: 'center' }}>
          Join as a <span style={{ color: '#f50057' }}>{role === 'freelancer' ? 'Freelancer' : 'Client'}</span>
        </h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '30px' }}>Create your TownTask account</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="text" placeholder="Full Name" required
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={inputStyle}
          />
          <input 
            type="email" placeholder="Email Address" required
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={inputStyle}
          />
          <input 
            type="password" placeholder="Password" required
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={inputStyle}
          />
          <input 
            type="text" placeholder="Your City" required
            onChange={(e) => setFormData({...formData, city: e.target.value})}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Create Account</button>
        </form>
      </motion.div>
    </div>
  );
};

const inputStyle = {
  padding: '14px',
  borderRadius: '8px',
  border: '1px solid #333',
  backgroundColor: '#1a1a1a',
  color: '#fff',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border 0.3s',
  fontFamily: "'Sora', sans-serif"
};

const buttonStyle = {
  padding: '16px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#f50057',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '10px'
};

export default Register;