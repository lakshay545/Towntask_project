import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => (
  <nav style={{ 
    padding: '20px 80px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    position: 'absolute', 
    width: '100%', 
    zIndex: 10,
    boxSizing: 'border-box'
  }}>
    <h2 style={{ color: '#fff', margin: 0, fontWeight: '800', fontSize: '24px' }}>
      TOWN<span style={{ color: '#f50057' }}>TASK</span>
    </h2>
    <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
      <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: '500' }}>Log In</Link>
      <Link to="/register/client" style={{ 
        color: '#fff', 
        textDecoration: 'none', 
        border: '2px solid #fff', 
        padding: '8px 20px', 
        borderRadius: '5px' 
      }}>Post a Project</Link>
    </div>
  </nav>
);

const Hero = () => {
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* BACKGROUND VIDEO */}
      <video
        autoPlay
        loop
        muted
        style={{
          position: 'absolute',
          width: '100%',
          left: '50%',
          top: '50%',
          height: '100%',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          zIndex: '-1'
        }}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY FOR TEXT READABILITY */}
      <div style={{ 
        position: 'absolute', 
        top: 0, left: 0, 
        width: '100%', height: '100%', 
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 0 
      }}></div>

      {/* CONTENT */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        height: '100%', 
        padding: '0 80px',
        maxWidth: '800px'
      }}>
        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ fontSize: '3.5rem', color: '#fff', margin: '0 0 20px 0', lineHeight: '1.1' }}
        >
          Hire the best experts <br /> for any task, online.
        </motion.h1>
        
        <motion.ul 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ color: '#fff', listStyle: 'none', padding: 0, fontSize: '1.2rem', marginBottom: '40px' }}
        >
          <li style={{ marginBottom: '10px' }}>✓ Local city-based experts</li>
          <li style={{ marginBottom: '10px' }}>✓ Save up to 50% & get quotes for free</li>
          <li>✓ Pay only when you're 100% happy</li>
        </motion.ul>

        <div style={{ display: 'flex', gap: '15px' }}>
          <Link to="/register/client">
            <button style={{ ...btnStyle, backgroundColor: '#f50057' }}>Hire a Freelancer</button>
          </Link>
          <Link to="/register/freelancer">
            <button style={{ ...btnStyle, backgroundColor: 'transparent', border: '2px solid #fff' }}>Earn Money Freelancing</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const btnStyle = {
  padding: '15px 30px',
  fontSize: '1rem',
  fontWeight: '700',
  color: '#fcf8f8',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: '0.3s'
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
      </Routes>
    </Router>
  );
}

export default App;