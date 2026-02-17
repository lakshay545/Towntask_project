import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SOSButton from '../components/SOSButton';
import DigiLockerVerify from '../components/DigiLockerVerify';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      // Decode the token or fetch user status
      // For now, we pull the user name/role stored during login
      const storedName = localStorage.getItem('userName') || "User";
      const storedRole = localStorage.getItem('userRole') || "Member";
      const isVerified = localStorage.getItem('isVerified') === 'true';

      setUser({ name: storedName, role: storedRole, isVerified: isVerified });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isVerified');
    navigate('/');
  };

  return (
    <div style={{ padding: '120px 20px', minHeight: '100vh', backgroundColor: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={cardStyle}
      >
        <h1 style={{ color: '#fff', textAlign: 'center' }}>Welcome, <span style={{ color: '#f50057' }}>{user?.name}</span></h1>
        <p style={{ color: '#888', textAlign: 'center' }}>Role: {user?.role} | Status: {user?.isVerified ? "✅ Verified" : "❌ Unverified"}</p>
        
        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={statBox}>🚀 Active Tasks: 0</div>
          <div style={statBox}>🛡️ Trust Score: {user?.isVerified ? "50" : "0"}</div>
        </div>

        <hr style={{ margin: '40px 0', borderColor: '#333' }} />

        {/* FEATURE 2: SOS EMERGENCY BUTTON */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h3 style={{ color: '#fff', marginBottom: '20px' }}>Need Urgent Help?</h3>
          <SOSButton />
          <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>This will alert nearby verified volunteers immediately.</p>
        </div>

        {/* FEATURE 4: VERIFICATION LOGIC */}
        {!user?.isVerified ? (
          <div style={{ marginTop: '20px' }}>
             <DigiLockerVerify />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', background: '#1a1a1a', borderRadius: '10px', border: '1px solid #4caf50' }}>
            <h4 style={{ color: '#4caf50' }}>You are a Verified Volunteer!</h4>
            <button 
              onClick={() => navigate('/volunteer-dashboard')}
              style={volunteerBtn}
            >
              Open Volunteer Radar
            </button>
          </div>
        )}

        <button onClick={handleLogout} style={logoutBtn}>Logout</button>
      </motion.div>
    </div>
  );
};

const cardStyle = { 
    background: '#111', 
    padding: '40px', 
    borderRadius: '15px', 
    border: '1px solid #333', 
    maxWidth: '800px', 
    width: '100%' 
};

const statBox = { background: '#1a1a1a', padding: '20px', borderRadius: '10px', color: '#fff', textAlign: 'center' };

const logoutBtn = { marginTop: '30px', padding: '10px 20px', background: 'transparent', border: '1px solid #f50057', color: '#f50057', cursor: 'pointer', borderRadius: '5px', width: '100%' };

const volunteerBtn = { marginTop: '10px', padding: '12px 24px', background: '#4caf50', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' };

export default Dashboard;