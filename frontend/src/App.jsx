import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// ============ NAVBAR COMPONENT ============
// ============ NAVBAR COMPONENT ============
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
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
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        style={{ cursor: 'pointer' }}
      >
        <h2 style={{
          color: '#fff',
          margin: 0,
          fontWeight: '900',
          fontSize: '26px',
          letterSpacing: '-1px',
          fontFamily: "'Sora', sans-serif",
        }}>
          TOWN<span style={{ color: '#f50057' }}>TASK</span>
        </h2>
      </motion.div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
        <motion.a
          href="#features"
          whileHover={{ color: '#f50057' }}
          style={{
            color: '#fff',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'color 0.3s',
            fontFamily: "'Sora', sans-serif",
          }}
        >
          Features
        </motion.a>
        <motion.a
          href="#how-it-works"
          whileHover={{ color: '#f50057' }}
          style={{
            color: '#fff',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'color 0.3s',
            fontFamily: "'Sora', sans-serif",
          }}
        >
          How It Works
        </motion.a>
        <Link
          to="/login"
          style={{
            color: '#fff',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '15px',
            cursor: 'pointer',
            fontFamily: "'Sora', sans-serif",
          }}
        >
          Log In
        </Link>
        <Link
          to="/register/client"
          style={{
            color: '#fff',
            textDecoration: 'none',
            backgroundColor: '#f50057',
            padding: '10px 24px',
            borderRadius: '6px',
            fontWeight: '700',
            fontSize: '14px',
            transition: 'all 0.3s',
            fontFamily: "'Sora', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#d4003d';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(245, 0, 87, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f50057';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Post a Task
        </Link>
      </div>
    </motion.nav>
  );
};

// ============ HERO COMPONENT ============
const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* BACKGROUND VIDEO */}
      <motion.video
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </motion.video>

      {/* GRADIENT OVERLAY - More sophisticated */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 50%, rgba(245,0,87,0.1) 100%)',
        zIndex: 1,
      }}></div>

      {/* CONTENT - HERO SECTION */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '900px',
          padding: '0 60px',
          textAlign: 'left',
        }}
      >
        {/* Main Heading */}
        <motion.div variants={itemVariants}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            color: '#fff',
            margin: '0 0 20px 0',
            lineHeight: '1.15',
            fontWeight: '900',
            fontFamily: "'Sora', sans-serif",
            letterSpacing: '-2px',
            textShadow: '0 10px 40px rgba(0,0,0,0.3)',
          }}>
            Hire the best{' '}
            <span style={{
              background: 'linear-gradient(135deg, #f50057 0%, #ff1744 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              local experts
            </span>
            {' '}for any task
          </h1>
        </motion.div>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          style={{
            fontSize: '1.3rem',
            color: '#e0e0e0',
            margin: '20px 0 30px 0',
            lineHeight: '1.6',
            fontFamily: "'Sora', sans-serif",
            fontWeight: '400',
          }}
        >
          Connect with verified freelancers in your city. Fast, affordable, and hassle-free.
        </motion.p>

        {/* Features List */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '40px',
          }}
        >
          {[
            'Local city-based experts you can trust',
            'Save up to 50% & get instant quotes',
            'Pay only when you\'re 100% happy',
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.15 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#fff',
                fontSize: '1rem',
                fontFamily: "'Sora', sans-serif",
                fontWeight: '500',
              }}
            >
              <span style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#f50057',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold',
                flexShrink: 0,
              }}>✓</span>
              {feature}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <Link to="/register/client">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 15px 40px rgba(245, 0, 87, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '16px 40px',
                fontSize: '1rem',
                fontWeight: '700',
                color: '#fff',
                backgroundColor: '#f50057',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: "'Sora', sans-serif",
                boxShadow: '0 10px 30px rgba(245, 0, 87, 0.3)',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Hire a Freelancer
            </motion.button>
          </Link>
          <Link to="/register/freelancer">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '16px 40px',
                fontSize: '1rem',
                fontWeight: '700',
                color: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid #fff',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: "'Sora', sans-serif",
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Earn Money
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

</div>
  );
};
// ============ FEATURES SECTION ============
const FeaturesSection = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Get matched with qualified freelancers in minutes, not days.',
    },
    {
      icon: '🔒',
      title: 'Verified & Trusted',
      description: 'All freelancers are verified with real reviews and ratings.',
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'Local experts offer competitive rates without middleman markups.',
    },
    {
      icon: '🏘️',
      title: 'Local Community',
      description: 'Support skilled professionals in your own neighborhood.',
    },
  ];

  return (
    <section
      id="features"
      style={{
        padding: '100px 60px',
        backgroundColor: '#0f0f0f',
        borderTop: '1px solid rgba(245, 0, 87, 0.1)',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{ maxWidth: '1200px', margin: '0 auto' }}
      >
        <h2 style={{
          fontSize: '3rem',
          fontWeight: '900',
          color: '#fff',
          marginBottom: '60px',
          textAlign: 'center',
          fontFamily: "'Sora', sans-serif",
          letterSpacing: '-1px',
        }}>
          Why choose{' '}
          <span style={{
            background: 'linear-gradient(135deg, #f50057 0%, #ff1744 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            TownTask
          </span>
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
        }}>
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              style={{
                padding: '40px 30px',
                backgroundColor: 'rgba(245, 0, 87, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(245, 0, 87, 0.1)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(245, 0, 87, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(245, 0, 87, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(245, 0, 87, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(245, 0, 87, 0.1)';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{feature.icon}</div>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '12px',
                fontFamily: "'Sora', sans-serif",
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: '#b0b0b0',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: 0,
                fontFamily: "'Sora', sans-serif",
              }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// ============ HOW IT WORKS SECTION ============
const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Post Your Task',
      description: 'Describe what you need and set your budget',
    },
    {
      num: '02',
      title: 'Get Quotes',
      description: 'Receive bids from local freelancers instantly',
    },
    {
      num: '03',
      title: 'Choose & Hire',
      description: 'Review profiles, ratings, and pick your expert',
    },
    {
      num: '04',
      title: 'Get It Done',
      description: 'Collaborate and pay only when satisfied',
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        padding: '100px 60px',
        backgroundColor: '#1a1a1a',
        borderTop: '1px solid rgba(245, 0, 87, 0.1)',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{ maxWidth: '1200px', margin: '0 auto' }}
      >
        <h2 style={{
          fontSize: '3rem',
          fontWeight: '900',
          color: '#fff',
          marginBottom: '20px',
          textAlign: 'center',
          fontFamily: "'Sora', sans-serif",
          letterSpacing: '-1px',
        }}>
          How it works
        </h2>
        <p style={{
          fontSize: '1.2rem',
          color: '#b0b0b0',
          textAlign: 'center',
          marginBottom: '60px',
          fontFamily: "'Sora', sans-serif",
        }}>
          Simple 4-step process to get your tasks done
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          position: 'relative',
        }}>
          {/* Connection line (desktop only) */}
          <div style={{
            position: 'absolute',
            top: '40px',
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(245,0,87,0.3), transparent)',
            display: window.innerWidth > 1024 ? 'block' : 'none',
            pointerEvents: 'none',
          }}></div>

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              viewport={{ once: true }}
              style={{
                position: 'relative',
                textAlign: 'center',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f50057 0%, #ff1744 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#fff',
                  boxShadow: '0 10px 30px rgba(245, 0, 87, 0.3)',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {step.num}
              </motion.div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '12px',
                fontFamily: "'Sora', sans-serif",
              }}>
                {step.title}
              </h3>
              <p style={{
                color: '#b0b0b0',
                fontSize: '1rem',
                lineHeight: '1.6',
                fontFamily: "'Sora', sans-serif",
              }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// ============ CTA SECTION ============
const CTASection = () => {
  return (
    <section style={{
      padding: '100px 60px',
      backgroundColor: '#0f0f0f',
      borderTop: '1px solid rgba(245, 0, 87, 0.1)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '60px 40px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(245, 0, 87, 0.1) 0%, rgba(245, 0, 87, 0.05) 100%)',
          border: '1px solid rgba(245, 0, 87, 0.2)',
        }}
      >
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '900',
          color: '#fff',
          marginBottom: '20px',
          fontFamily: "'Sora', sans-serif",
          letterSpacing: '-1px',
        }}>
          Ready to get started?
        </h2>
        <p style={{
          fontSize: '1.2rem',
          color: '#b0b0b0',
          marginBottom: '40px',
          lineHeight: '1.6',
          fontFamily: "'Sora', sans-serif",
        }}>
          Join thousands of clients and freelancers already using TownTask to complete their projects.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register/client">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '16px 40px',
                fontSize: '1rem',
                fontWeight: '700',
                color: '#fff',
                backgroundColor: '#f50057',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: "'Sora', sans-serif",
                boxShadow: '0 10px 30px rgba(245, 0, 87, 0.3)',
              }}
            >
              Post Your First Task
            </motion.button>
          </Link>
          <Link to="/register/freelancer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '16px 40px',
                fontSize: '1rem',
                fontWeight: '700',
                color: '#fff',
                backgroundColor: 'transparent',
                border: '2px solid #f50057',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: "'Sora', sans-serif",
              }}
            >
              Start Freelancing
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

// ============ FOOTER ============
const Footer = () => {
  return (
    <footer style={{
      padding: '40px 60px',
      backgroundColor: '#000',
      borderTop: '1px solid rgba(245, 0, 87, 0.1)',
      textAlign: 'center',
      color: '#888',
      fontFamily: "'Sora', sans-serif",
    }}>
      <p style={{ margin: '0 0 10px 0' }}>© 2024 TownTask. All rights reserved.</p>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <a href="#" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.3s' }}
          onMouseEnter={(e) => e.target.style.color = '#f50057'}
          onMouseLeave={(e) => e.target.style.color = '#888'}
        >
          Privacy
        </a>
        <a href="#" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.3s' }}
          onMouseEnter={(e) => e.target.style.color = '#f50057'}
          onMouseLeave={(e) => e.target.style.color = '#888'}
        >
          Terms
        </a>
        <a href="#" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.3s' }}
          onMouseEnter={(e) => e.target.style.color = '#f50057'}
          onMouseLeave={(e) => e.target.style.color = '#888'}
        >
          Contact
        </a>
      </div>
    </footer>
  );
};

// ============ MAIN APP COMPONENT ============
function App() {
  return (
    <Router>
      <div style={{
        backgroundColor: '#000',
        color: '#fff',
        fontFamily: "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <FeaturesSection />
              <HowItWorks />
              <CTASection />
              <Footer />
            </>
          } />

{/* Authentication & Dashboard Routes */}
          <Route path="/register/:role" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;