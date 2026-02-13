import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // THE UPDATED CODE GOES HERE:
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token); 
      alert("Login Successful!");
      navigate('/dashboard'); // This now sends them to the Dashboard instead of Home
      
    } catch (err) {
      // This handles the "Invalid Credentials" error from your image!
      alert(err.response?.data?.msg || "Login Failed");
    }
  };

  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={cardStyle}>
        <h2 style={{ color: '#fff', textAlign: 'center', fontSize: '2rem' }}>Welcome <span style={{ color: '#f50057' }}>Back</span></h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
          <input 
            type="email" placeholder="Email" required style={inputStyle}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input 
            type="password" placeholder="Password" required style={inputStyle}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="submit" style={buttonStyle}>Sign In</button>
        </form>
        <p style={{ color: '#888', textAlign: 'center', marginTop: '20px' }}>
          Don't have an account? <Link to="/register/client" style={{ color: '#f50057', textDecoration: 'none' }}>Register</Link>
        </p>
      </motion.div>
    </div>
  );
};

// Styles to match your beautiful landing page
const containerStyle = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a' };
const cardStyle = { width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: '#111', borderRadius: '16px', border: '1px solid rgba(245, 0, 87, 0.2)' };
const inputStyle = { padding: '14px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: '#fff', outline: 'none' };
const buttonStyle = { padding: '16px', borderRadius: '8px', border: 'none', backgroundColor: '#f50057', color: '#fff', fontWeight: 'bold', cursor: 'pointer' };

export default Login;