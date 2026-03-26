import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(localStorage.getItem('selectedRole') || null);
  const [unreadCount, setUnreadCount] = useState(3);
  const [profileProgress, setProfileProgress] = useState(75);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('selectedRole');
    if (!role) {
      navigate('/');
    }
    setSelectedRole(role);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (!selectedRole) {
    return <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  const isWorker = selectedRole === 'worker';

  return (
    <div style={containerStyle}>
      {/* === HEADER === */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={headerStyle}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>
            TOWN<span style={{ color: '#f50057' }}>TASK</span>
          </h1>
          <span style={roleIndicatorStyle}>{isWorker ? '👷 Worker' : '📝 Poster'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={notificationBellStyle}>
            💬 <span style={{ fontSize: '0.8rem', position: 'absolute', top: 0, right: 0, background: '#f50057', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>
          </div>
          <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
        </div>
      </motion.header>

      {/* === MAIN CONTENT === */}
      <div style={mainGridStyle}>
        {/* === PRIMARY FEED === */}
        <div style={feedColumnStyle}>
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={welcomeBannerStyle}
          >
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem' }}>
                Welcome back! 👋
              </h2>
              <p style={{ margin: 0, color: '#b0b0b0' }}>
                {isWorker 
                  ? 'Browse jobs in your area and start earning today'
                  : 'Post tasks and find the perfect help'
                }
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={primaryActionBtnStyle}
            >
              {isWorker ? '🔍 Browse Jobs' : '➕ Post Task'}
            </motion.button>
          </motion.div>

          {/* Job/Task Cards */}
          <div style={{ display: 'grid', gap: '16px', marginTop: '24px' }}>
            {isWorker ? (
              // Worker Job Cards
              <>
                {[1, 2, 3].map((job) => (
                  <motion.div
                    key={job}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * job }}
                    style={jobCardStyle}
                  >
                    <div style={{ borderLeft: '4px solid #2196F3', paddingLeft: '16px' }}>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>
                        House Cleaning Service
                      </h3>
                      <p style={{ margin: '0 0 8px 0', color: '#b0b0b0', fontSize: '0.9rem' }}>
                        📍 3 km away • Posted 2 hours ago
                      </p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        <span style={tagStyle}>Cleaning</span>
                        <span style={tagStyle}>Home</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#f50057' }}>₹2,500</span>
                        <button style={viewDetailsBtnStyle}>View Details</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>
            ) : (
              // Poster Task Cards
              <>
                {[1, 2, 3].map((task) => (
                  <motion.div
                    key={task}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * task }}
                    style={taskCardStyle}
                  >
                    <div style={{ borderLeft: '4px solid #9C27B0', paddingLeft: '16px' }}>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>
                        Website Redesign
                      </h3>
                      <p style={{ margin: '0 0 8px 0', color: '#b0b0b0', fontSize: '0.9rem' }}>
                        Posted • 5 proposals received
                      </p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        <span style={tagStyle}>Design</span>
                        <span style={tagStyle}>Web</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#9C27B0' }}>₹15,000</span>
                        <button style={viewDetailsBtnStyle}>Manage</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* === SIDEBAR === */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          style={sidebarStyle}
        >
          {/* Profile Progress */}
          <div style={sidebarCardStyle}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: '700' }}>
              Profile Completion
            </h3>
            <div style={progressBarStyle}>
              <motion.div
                animate={{ width: `${profileProgress}%` }}
                transition={{ duration: 1 }}
                style={progressFillStyle}
              />
            </div>
            <p style={{ margin: '8px 0 16px 0', color: '#b0b0b0', fontSize: '0.85rem' }}>
              {profileProgress}% complete
            </p>
            <button style={completeBtnStyle}>Complete Profile</button>
          </div>

          {/* Task Checklist */}
          <div style={sidebarCardStyle}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: '700' }}>
              Setup Checklist
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Basic Info', done: true },
                { label: 'Location', done: true },
                { label: 'Skills', done: false },
                { label: 'Verification', done: false }
              ].map((item) => (
                <label key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={item.done} readOnly style={{ cursor: 'pointer' }} />
                  <span style={{ fontSize: '0.9rem', color: item.done ? '#666' : '#fff', textDecoration: item.done ? 'line-through' : 'none' }}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Pro Tips */}
          <div style={{ ...sidebarCardStyle, background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05))', border: '1px solid rgba(255, 193, 7, 0.2)' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: '700', color: '#FFC107' }}>
              💡 Pro Tips
            </h3>
            <p style={{ margin: 0, color: '#b0b0b0', fontSize: '0.85rem', lineHeight: '1.4' }}>
              {isWorker
                ? 'Complete your profile to get 2x more job recommendations in your area.'
                : 'Jobs with detailed descriptions get 3x more proposals. Add photos!'}
            </p>
            <a href="#" style={{ fontSize: '0.85rem', color: '#FFC107', textDecoration: 'none', marginTop: '8px', display: 'inline-block' }}>
              Learn more →
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// === STYLES ===
const containerStyle = {
  minHeight: '100vh',
  background: '#000',
  color: '#fff',
  padding: '20px',
  fontFamily: "'Sora', sans-serif"
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 0',
  marginBottom: '30px',
  borderBottom: '1px solid rgba(245, 0, 87, 0.2)',
};

const roleIndicatorStyle = {
  background: 'rgba(245, 0, 87, 0.1)',
  border: '1px solid rgba(245, 0, 87, 0.3)',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '0.85rem',
  fontWeight: '600'
};

const notificationBellStyle = {
  position: 'relative',
  fontSize: '1.2rem',
  cursor: 'pointer'
};

const logoutBtnStyle = {
  background: 'transparent',
  border: '1px solid #f50057',
  color: '#f50057',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.9rem'
};

const mainGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 320px',
  gap: '30px',
  maxWidth: '1400px',
  margin: '0 auto'
};

const feedColumnStyle = {
  minHeight: '600px'
};

const welcomeBannerStyle = {
  background: 'linear-gradient(135deg, rgba(245, 0, 87, 0.1), rgba(255, 255, 255, 0.03))',
  border: '1px solid rgba(245, 0, 87, 0.2)',
  padding: '24px',
  borderRadius: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '20px'
};

const primaryActionBtnStyle = {
  background: '#f50057',
  color: '#fff',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '0.95rem',
  whiteSpace: 'nowrap'
};

const jobCardStyle = {
  background: '#111',
  border: '1px solid #222',
  borderRadius: '12px',
  padding: '16px',
  transition: 'all 0.3s ease',
  cursor: 'pointer'
};

const taskCardStyle = {
  ...jobCardStyle
};

const tagStyle = {
  background: 'rgba(33, 150, 243, 0.15)',
  color: '#2196F3',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: '600'
};

const viewDetailsBtnStyle = {
  background: 'transparent',
  border: '1px solid #666',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: '600'
};

const sidebarStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const sidebarCardStyle = {
  background: '#111',
  border: '1px solid #222',
  borderRadius: '12px',
  padding: '16px'
};

const progressBarStyle = {
  width: '100%',
  height: '6px',
  background: '#222',
  borderRadius: '3px',
  overflow: 'hidden'
};

const progressFillStyle = {
  height: '100%',
  background: 'linear-gradient(90deg, #f50057, #ff1744)',
  transition: 'width 0.3s ease'
};

const completeBtnStyle = {
  width: '100%',
  background: '#f50057',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.85rem'
};

export default Dashboard;