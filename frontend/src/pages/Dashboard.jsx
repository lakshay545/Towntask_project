import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check if token exists in LocalStorage
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login if not authenticated
    } else {
      // For now, we'll simulate getting user data. 
      // Later we will fetch real data from /api/auth/me
      setUser({ name: "User", role: "Member" }); 
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ padding: '120px 60px', minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={cardStyle}
      >
        <h1 style={{ color: '#fff' }}>Welcome to your <span style={{ color: '#f50057' }}>Dashboard</span></h1>
        <p style={{ color: '#888' }}>You are logged in as a {user?.role}</p>
        
        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={statBox}>🚀 Active Tasks: 0</div>
          <div style={statBox}>💰 Earnings/Spent: $0</div>
        </div>

        <button onClick={handleLogout} style={logoutBtn}>Logout</button>
      </motion.div>
    </div>
  );
};

const cardStyle = { background: '#111', padding: '40px', borderRadius: '15px', border: '1px solid #333' };
const statBox = { background: '#1a1a1a', padding: '20px', borderRadius: '10px', color: '#fff', textAlign: 'center' };
const logoutBtn = { marginTop: '30px', padding: '10px 20px', background: 'transparent', border: '1px solid #f50057', color: '#f50057', cursor: 'pointer', borderRadius: '5px' };

export default Dashboard;
