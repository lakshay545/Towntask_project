import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VolunteerDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('token');
        // This endpoint will return OPEN emergencies nearby
        const res = await axios.get('http://localhost:5000/api/emergency/nearby', {
          headers: { 'x-auth-token': token }
        });
        setAlerts(res.data);
      } catch (err) {
        console.error("Error fetching alerts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    // Auto-refresh every 30 seconds to catch new SOS signals
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/emergency/accept/${id}`, {}, {
        headers: { 'x-auth-token': token }
      });
      alert("Emergency Accepted! Exact location is now visible.");
      // Redirect to a map view or detail page here
    } catch (err) {
      alert(err.response?.data?.msg || "Could not accept");
    }
  };

  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
      <h2>🆘 Active Emergency Alerts</h2>
      {loading ? <p>Scanning for signals...</p> : (
        <div className="alerts-list">
          {alerts.length === 0 ? <p>No active emergencies in your area. Thank you for being ready!</p> : 
            alerts.map(alert => (
              <div key={alert._id} style={{
                border: '2px solid red', 
                margin: '10px 0', 
                padding: '15px', 
                borderRadius: '8px',
                backgroundColor: '#fff5f5'
              }}>
                <h3>{alert.category} - {new Date(alert.createdAt).toLocaleTimeString()}</h3>
                <p>{alert.description}</p>
                <p><strong>Status:</strong> {alert.status}</p>
                <button 
                  onClick={() => handleAccept(alert._id)}
                  style={{ backgroundColor: 'green', color: 'white', padding: '10px' }}
                >
                  Accept & Help
                </button>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;