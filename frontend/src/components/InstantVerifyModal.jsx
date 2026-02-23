import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const InstantVerifyModal = ({ isOpen, onClose, onSuccess }) => {
  const [aadhaar, setAadhaar] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInstantSubmit = async () => {
    if (aadhaar.length !== 12) return alert("Enter valid 12-digit Aadhaar");
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/auth/instant-verify', 
        { aadhaarNumber: aadhaar },
        { headers: { 'x-auth-token': token } }
      );
      
      localStorage.setItem('volunteer_status', 'TEMP_VERIFIED');
      alert(res.data.msg);
      onSuccess(); // Triggers the "Accept SOS" action
      onClose();
    } catch (err) {
      alert("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={modalStyle}>
        <h2 style={{ color: '#fff' }}>⚡ Instant Verification</h2>
        <p style={{ color: '#888' }}>To help in this emergency, we need a quick identity check.</p>
        
        <div style={inputGroup}>
          <label style={labelStyle}>Aadhaar Number</label>
          <input 
            type="text" 
            maxLength="12"
            placeholder="1234 5678 9101" 
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={selfieBox}>
          <span style={{ fontSize: '24px' }}>📸</span>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>Camera verification active...</p>
        </div>

        <button onClick={handleInstantSubmit} disabled={loading} style={btnStyle}>
          {loading ? "Verifying..." : "Verify & Help Now"}
        </button>
        <button onClick={onClose} style={cancelBtn}>Cancel</button>
      </motion.div>
    </div>
  );
};

// Styles
const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { background: '#111', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '400px', border: '1px solid #f50057', textAlign: 'center' };
const inputStyle = { width: '100%', padding: '12px', background: '#222', border: '1px solid #333', color: '#fff', borderRadius: '8px', marginTop: '10px' };
const labelStyle = { color: '#f50057', fontSize: '12px', fontWeight: 'bold', display: 'block', textAlign: 'left' };
const selfieBox = { border: '2px dashed #333', padding: '20px', borderRadius: '10px', margin: '20px 0', color: '#666' };
const btnStyle = { width: '100%', padding: '14px', background: '#f50057', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const cancelBtn = { background: 'none', border: 'none', color: '#555', marginTop: '15px', cursor: 'pointer' };

export default InstantVerifyModal;