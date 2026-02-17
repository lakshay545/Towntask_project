import React, { useState } from 'react';
import axios from 'axios';

const DigiLockerVerify = () => {
  const [id, setId] = useState('');

  const handleVerify = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/auth/verify-volunteer', 
        { digiLockerId: id },
        { headers: { 'x-auth-token': token } }
      );
      alert(res.data.msg);
    } catch (err) {
      alert("Verification failed. Check your ID.");
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
      <h3>🛡️ Become a Verified Volunteer</h3>
      <p>Enter your DigiLocker ID to help your community in emergencies.</p>
      <input 
        type="text" 
        placeholder="Enter DigiLocker ID" 
        value={id}
        onChange={(e) => setId(e.target.value)}
        style={{ padding: '10px', width: '80%', marginBottom: '10px' }}
      />
      <button onClick={handleVerify} style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px' }}>
        Verify via DigiLocker
      </button>
    </div>
  );
};
export default DigiLockerVerify;