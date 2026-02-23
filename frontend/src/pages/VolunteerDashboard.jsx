import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import InstantVerifyModal from '../components/InstantVerifyModal';

// --- SUB-COMPONENT: TRUST CARD ---
const TrustCard = ({ details }) => {
  if (!details) return null;
  
  // Logic to determine badge emoji
  const getBadge = (level) => {
    if (level === 'Gold') return '🥇';
    if (level === 'Silver') return '🥈';
    return '🥉';
  };

  return (
    <div style={badgeCardStyle}>
      <div style={{ fontSize: '40px' }}>{getBadge(details.badges)}</div>
      <div style={{ flex: 2 }}>
        <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>{details.badges} Level Volunteer</h4>
        <p style={{ margin: '4px 0', color: '#4caf50', fontWeight: 'bold' }}>
          Trust Score: {details.trustScore} Pts
        </p>
        <div style={progressBarContainer}>
          <div style={progressFill(details.trustScore)} />
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const VolunteerDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null); // Added for TrustCard
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetSOS, setTargetSOS] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'x-auth-token': token };

      // Fetch Alerts and User Stats in parallel
      const [alertRes, userRes] = await Promise.all([
        axios.get('http://localhost:5000/api/emergency/nearby', { headers }),
        axios.get('http://localhost:5000/api/auth/me', { headers }) // Ensure this route exists
      ]);

      setAlerts(alertRes.data);
      setUserStats(userRes.data.volunteerDetails);
      
      // Update local storage status just in case it changed
      localStorage.setItem('volunteer_status', userRes.data.volunteer_status);
      
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptAttempt = (sos) => {
    const status = localStorage.getItem('volunteer_status');
    if (status === 'VERIFIED' || status === 'TEMP_VERIFIED') {
      proceedToAccept(sos._id);
    } else {
      setTargetSOS(sos);
      setIsModalOpen(true);
    }
  };

  const proceedToAccept = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/emergency/accept/${id}`, {}, {
        headers: { 'x-auth-token': token }
      });
      alert("✅ Emergency Accepted! Navigating to victim's location...");
      fetchData(); 
    } catch (err) {
      alert(err.response?.data?.msg || "Could not accept");
    }
  };

  return (
    <div style={containerStyle}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        
        {/* TRUST CARD DISPLAY */}
        <TrustCard details={userStats} />

        <h2 style={{ color: '#fff', marginTop: '30px' }}>📡 Emergency <span style={{ color: '#f50057' }}>Radar</span></h2>
        <p style={{ color: '#888' }}>Scanning for distress signals in your area...</p>

        {loading ? (
          <div style={loaderStyle}>Initializing Radar...</div>
        ) : (
          <div style={{ marginTop: '30px' }}>
            {alerts.length === 0 ? (
              <div style={emptyStyle}>No active emergencies nearby. Stay alert!</div>
            ) : (
              alerts.map(alert => (
                <motion.div key={alert._id} whileHover={{ scale: 1.01 }} style={alertCard(alert.urgencyLevel)}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>🚨 {alert.category}</h3>
                    <p style={{ fontSize: '14px', color: '#ccc' }}>{alert.description}</p>
                    <span style={timeTag}>{new Date(alert.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <button onClick={() => handleAcceptAttempt(alert)} style={acceptBtn}>Accept & Help</button>
                </motion.div>
              ))
            )}
          </div>
        )}
      </motion.div>

      <InstantVerifyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => proceedToAccept(targetSOS?._id)}
      />
    </div>
  );
};

// --- STYLES ---
const containerStyle = { padding: '120px 40px', minHeight: '100vh', backgroundColor: '#0a0a0a', fontFamily: "'Sora', sans-serif" };

const badgeCardStyle = { 
  display: 'flex', alignItems: 'center', gap: '20px', background: 'linear-gradient(145deg, #1a1a1a, #111)', 
  padding: '25px', borderRadius: '16px', border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' 
};

const progressBarContainer = { width: '100%', height: '8px', background: '#222', borderRadius: '10px', marginTop: '10px', overflow: 'hidden' };

const progressFill = (score) => ({ 
  width: `${Math.min((score / 100) * 100, 100)}%`, height: '100%', 
  background: 'linear-gradient(90deg, #4caf50, #81c784)', transition: 'width 1s ease-out' 
});

const alertCard = (urgency) => ({
  borderLeft: urgency === 'High' ? '5px solid #f50057' : '5px solid #ff9800',
  background: '#111', margin: '15px 0', padding: '20px', borderRadius: '12px',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff'
});

const acceptBtn = { backgroundColor: '#4caf50', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
const timeTag = { background: '#222', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#888' };
const emptyStyle = { textAlign: 'center', color: '#555', padding: '50px', border: '1px dashed #333', borderRadius: '10px' };
const loaderStyle = { color: '#f50057', textAlign: 'center', padding: '40px', fontWeight: 'bold' };

export default VolunteerDashboard;