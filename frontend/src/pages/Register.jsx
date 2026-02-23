import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Register = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '', // Added for Step 1 Requirement
    password: '',
    city: '',
    userRole: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        ...formData,
        userRole: role || 'client'
      });

      // 1. Save token & user info immediately (Needed for Step 2)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userRole', role || 'client');

      // 2. Redirect to Step 2: Volunteer Choice Page
      navigate('/volunteer-choice'); 
      
    } catch (err) {
      alert(err.response?.data?.msg || "Registration Failed");
    }
  };

  return (
    <div style={containerStyle}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={cardStyle}
      >
        <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '10px', textAlign: 'center' }}>
          Join as a <span style={{ color: '#f50057' }}>{role === 'freelancer' ? 'Freelancer' : 'Client'}</span>
        </h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '30px' }}>Step 1: Create your TownTask account</p>

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
          {/* NEW MOBILE FIELD */}
          <input 
            type="text" placeholder="Mobile Number (for OTP)" required
            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
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
          <button type="submit" style={buttonStyle}>Register & Continue</button>
        </form>
      </motion.div>
    </div>
  );
};

// --- STYLES ---
const containerStyle = { 
  minHeight: '100vh', display: 'flex', alignItems: 'center', 
  justifyContent: 'center', backgroundColor: '#0a0a0a', padding: '20px' 
};

const cardStyle = {
  width: '100%', maxWidth: '450px', padding: '40px', borderRadius: '16px',
  backgroundColor: '#111', border: '1px solid rgba(245, 0, 87, 0.2)',
  boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
};

const inputStyle = {
  padding: '14px', borderRadius: '8px', border: '1px solid #333',
  backgroundColor: '#1a1a1a', color: '#fff', fontSize: '1rem', outline: 'none'
};

const buttonStyle = {
  padding: '16px', borderRadius: '8px', border: 'none',
  backgroundColor: '#f50057', color: '#fff', fontWeight: 'bold',
  fontSize: '1rem', cursor: 'pointer', marginTop: '10px'
};

export default Register;