import Register from './Register';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, UserPlus } from 'lucide-react';

// A simple Navbar to make it look official
const Navbar = () => (
  <nav style={{ padding: '20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
    <h2 style={{ color: '#fff', margin: 0, letterSpacing: '1px' }}>TOWN<span style={{ color: '#4f46e5' }}>TASK</span></h2>
    <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
  </nav>
);

const Home = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', 
      color: '#fff',
      fontFamily: "'Inter', sans-serif"
    }}>
      <Navbar />
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center' }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ fontSize: '3.5rem', marginBottom: '10px' }}
        >
          Hometown Work, <span style={{ color: '#818cf8' }}>Global Quality.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', marginBottom: '40px' }}
        >
          The most trusted way to hire local experts or earn money using your skills in your city.
        </motion.p>

        <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* HIRE CARD */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/register/client" style={{ textDecoration: 'none' }}>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '40px', borderRadius: '20px', width: '220px', cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                <Briefcase size={40} color="#818cf8" style={{ marginBottom: '15px' }} />
                <h3 style={{ color: '#fff' }}>I want to Hire</h3>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Find local talent for your projects.</p>
              </div>
            </Link>
          </motion.div>

          {/* EARN CARD */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/register/freelancer" style={{ textDecoration: 'none' }}>
              <div style={{ 
                background: 'linear-gradient(145deg, #4f46e5, #3730a3)', 
                padding: '40px', borderRadius: '20px', width: '220px', cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)'
              }}>
                <UserPlus size={40} color="#fff" style={{ marginBottom: '15px' }} />
                <h3 style={{ color: '#fff' }}>I want to Earn</h3>
                <p style={{ fontSize: '0.9rem', color: '#e0e7ff' }}>Showcase skills & get paid locally.</p>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* The Landing Page */}
       <Route path="/register/:role" element={<Register />} />

        {/* This is a "Catch-All" route. If a user types a wrong URL, 
            it sends them back to the Home page instead of a 404 */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;