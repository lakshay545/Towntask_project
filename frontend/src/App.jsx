import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. CRITICAL IMPORTS (Ensure these files exist!) ---
import VolunteerChoice from './pages/VolunteerChoice';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';

// ============ NAVBAR COMPONENT ============
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '20px 60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 100,
        boxSizing: 'border-box',
        backdropFilter: isScrolled ? 'blur(10px)' : 'blur(0px)',
        backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        transition: 'all 0.3s ease',
        borderBottom: isScrolled ? '1px solid rgba(245, 0, 87, 0.3)' : '1px solid rgba(245, 0, 87, 0.1)',
      }}
    >
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h2 style={{ color: '#fff', margin: 0, fontWeight: '900', fontSize: '26px', letterSpacing: '-1px', fontFamily: "'Sora', sans-serif" }}>
          TOWN<span style={{ color: '#f50057' }}>TASK</span>
        </h2>
      </Link>

      <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
        {token ? (
          <>
            <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>
            <Link to="/volunteer-dashboard" style={{ ...navLinkStyle, color: '#f50057', fontWeight: 'bold' }}>📡 Radar</Link>
            <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
          </>
        ) : (
          <>
            <a href="#features" style={navLinkStyle}>Features</a>
            <a href="#how-it-works" style={navLinkStyle}>How It Works</a>
            <Link to="/login" style={navLinkStyle}>Log In</Link>
            <Link to="/register" style={postTaskBtnStyle}>Post a Task</Link>
          </>
        )}
      </div>
    </motion.nav>
  );
};

// ============ HERO COMPONENT (Full Version) ============
const Hero = () => {
  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <video autoPlay loop muted playsInline style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(245,0,87,0.1) 100%)', zIndex: 1 }}></div>
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} style={{ position: 'relative', zIndex: 2, textAlign: 'left', maxWidth: '900px', padding: '0 60px' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: '#fff', fontWeight: '900', fontFamily: "'Sora', sans-serif", letterSpacing: '-2px', lineHeight: '1.1' }}>
          Hire the best <span style={{ color: '#f50057' }}>local experts</span> for any task
        </h1>
        <p style={{ fontSize: '1.3rem', color: '#e0e0e0', margin: '25px 0 40px', maxWidth: '600px' }}>
          Connect with verified freelancers in your city. Fast, affordable, and hassle-free.
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
            {/* UPDATED LINKS TO MATCH NEW ROUTE */}
            <Link to="/register" style={postTaskBtnStyle}>Hire a Freelancer</Link>
            <Link to="/register" style={{ ...navLinkStyle, border: '2px solid #fff', padding: '14px 40px', borderRadius: '8px' }}>Earn Money</Link>
        </div>
      </motion.div>
    </div>
  );
};

// ============ FULL FEATURES SECTION ============
const FeaturesSection = () => (
  <section id="features" style={{ padding: '100px 60px', backgroundColor: '#0f0f0f' }}>
    <h2 style={{ color: '#fff', fontSize: '3rem', textAlign: 'center', fontWeight: '900', marginBottom: '60px' }}>Why choose <span style={{color:'#f50057'}}>TownTask</span></h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
      {['⚡ Lightning Fast', '🔒 Verified & Trusted', '💰 Best Prices', '🏘️ Local Community'].map((f, i) => (
        <motion.div key={i} whileHover={{ y: -10 }} style={{ padding: '40px', background: 'rgba(245,0,87,0.05)', borderRadius: '15px', border: '1px solid rgba(245,0,87,0.1)' }}>
          <h3 style={{ color: '#fff', fontSize: '1.4rem' }}>{f}</h3>
          <p style={{ color: '#b0b0b0' }}>The best local service at your fingertips.</p>
        </motion.div>
      ))}
    </div>
  </section>
);

// ============ HOW IT WORKS SECTION ============
const HowItWorks = () => (
    <section id="how-it-works" style={{ padding: '100px 60px', backgroundColor: '#1a1a1a', textAlign: 'center' }}>
      <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', marginBottom: '60px' }}>How it works</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px' }}>
        {['Post Task', 'Get Quotes', 'Choose Expert', 'Done!'].map((step, i) => (
          <div key={i}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f50057', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '1.5rem', fontWeight: 'bold' }}>{i+1}</div>
            <h3 style={{ color: '#fff', marginTop: '20px' }}>{step}</h3>
          </div>
        ))}
      </div>
    </section>
);

// ============ FOOTER ============
const Footer = () => (
  <footer style={{ padding: '60px', backgroundColor: '#000', textAlign: 'center', color: '#666', borderTop: '1px solid #222' }}>
    <p>© 2024 TownTask. All rights reserved.</p>
  </footer>
);

// ============ MAIN APP ============
function App() {
  return (
    <Router>
      <div style={{ backgroundColor: '#000', color: '#fff', fontFamily: "'Sora', sans-serif", minHeight: '100vh' }}>
        <Navbar />
        <Routes>
          {/* Main Landing Page */}
          <Route path="/" element={<><Hero /><FeaturesSection /><HowItWorks /><Footer /></>} />
          
          {/* Auth Routes - UPDATED to handle /register/client etc. */}
          <Route path="/login" element={<Login />} />
          <Route path="/register/*" element={<Register />} />          
          {/* Functional Routes */}
          <Route path="/volunteer-choice" element={<VolunteerChoice />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

// --- SHARED STYLES ---
const navLinkStyle = { color: '#fff', textDecoration: 'none', fontWeight: '500', fontSize: '15px' };
const logoutBtnStyle = { background: 'transparent', border: '1px solid #f50057', color: '#f50057', padding: '6px 15px', borderRadius: '4px', cursor: 'pointer' };
const postTaskBtnStyle = { backgroundColor: '#f50057', color: '#fff', padding: '12px 30px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' };

export default App;