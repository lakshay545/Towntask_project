import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(localStorage.getItem('selectedRole') || null);

  useEffect(() => {
    const role = localStorage.getItem('selectedRole');
    if (role !== 'worker') {
      // If not a worker, redirect to regular dashboard
      navigate('/dashboard');
    }
    setSelectedRole(role);
  }, [navigate]);

  // Sample jobs data (in real app, fetch from API)
  const jobs = [
    { id: 1, title: 'House Cleaning', category: 'Cleaning', budget: 2500, distance: '0.5 km', posted: '1 hour ago' },
    { id: 2, title: 'Website Redesign', category: 'Design', budget: 15000, distance: '2 km', posted: '2 hours ago' },
    { id: 3, title: 'Furniture Moving', category: 'Moving', budget: 5000, distance: '1.2 km', posted: '30 min ago' },
    { id: 4, title: 'Plumbing Repair', category: 'Repair', budget: 3200, distance: '0.8 km', posted: '45 min ago' },
    { id: 5, title: 'Graphic Design Project', category: 'Design', budget: 12000, distance: '3 km', posted: '3 hours ago' },
  ];

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={headerStyle}
      >
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '2.2rem', fontWeight: '900' }}>
            🔥 Trending Jobs Near You
          </h1>
          <p style={{ margin: 0, color: '#b0b0b0', fontSize: '1rem' }}>
            Start earning today with these high-demand tasks
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          style={backBtnStyle}
        >
          ← Dashboard
        </button>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={filterBarStyle}
      >
        <select style={filterSelectStyle}>
          <option>All Categories</option>
          <option>Cleaning</option>
          <option>Design</option>
          <option>Moving</option>
          <option>Repair</option>
        </select>
        <select style={filterSelectStyle}>
          <option>All Budgets</option>
          <option>Under ₹2,000</option>
          <option>₹2,000 - ₹5,000</option>
          <option>₹5,000+</option>
        </select>
        <select style={filterSelectStyle}>
          <option>Closest First</option>
          <option>Highest Budget</option>
          <option>Recently Posted</option>
        </select>
      </motion.div>

      {/* Jobs Grid */}
      <div style={jobsGridStyle}>
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(245, 0, 87, 0.15)' }}
            style={jobCardStyle}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: '700' }}>
                  {job.title}
                </h3>
                <p style={{ margin: 0, color: '#b0b0b0', fontSize: '0.85rem' }}>
                  {job.category}
                </p>
              </div>
              <span style={budgetBadgeStyle}>₹{job.budget.toLocaleString()}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888' }}>
                📍 {job.distance}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888' }}>
                🕐 {job.posted}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={viewBtnStyle}>View Job</button>
              <button style={biddBtnStyle}>Submit Bid</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {jobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={emptyStateStyle}
        >
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
          <h2 style={{ margin: '0 0 8px 0' }}>No jobs found</h2>
          <p style={{ color: '#b0b0b0', margin: 0 }}>Try adjusting your filters or check back later</p>
        </motion.div>
      )}
    </div>
  );
};

// === STYLES ===
const containerStyle = {
  minHeight: '100vh',
  background: '#000',
  color: '#fff',
  padding: '40px 20px',
  fontFamily: "'Sora', sans-serif"
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '40px',
  paddingBottom: '20px',
  borderBottom: '1px solid rgba(245, 0, 87, 0.2)'
};

const backBtnStyle = {
  background: 'transparent',
  border: '1px solid #666',
  color: '#fff',
  padding: '10px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.9rem'
};

const filterBarStyle = {
  display: 'flex',
  gap: '12px',
  marginBottom: '32px',
  flexWrap: 'wrap'
};

const filterSelectStyle = {
  background: '#111',
  border: '1px solid #333',
  color: '#fff',
  padding: '10px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: '500'
};

const jobsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  gap: '20px',
  maxWidth: '1400px'
};

const jobCardStyle = {
  background: '#111',
  border: '1px solid #222',
  borderRadius: '12px',
  padding: '20px',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const budgetBadgeStyle = {
  background: 'linear-gradient(135deg, #f50057, #ff1744)',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: '6px',
  fontWeight: '700',
  fontSize: '0.9rem'
};

const viewBtnStyle = {
  flex: 1,
  background: 'transparent',
  border: '1px solid #666',
  color: '#fff',
  padding: '10px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.85rem'
};

const biddBtnStyle = {
  flex: 1,
  background: '#f50057',
  color: '#fff',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '0.85rem'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '60px 20px',
  color: '#888'
};

export default VolunteerDashboard;