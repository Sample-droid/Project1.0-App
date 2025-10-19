import React, { useState, useEffect } from 'react';
import './logindashboard.css';
const LoginDashboard = () => {
  const [activeSection, setActiveSection] = useState('userInfo');
  const [userData, setUserData] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    window.location.href = '/login'; // Redirect to login page
  };

  // Fetch user data from backend
  useEffect(() => {
    if (activeSection === 'userInfo') {
      setLoading(true);
      fetch('/api/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          return response.json();
        })
        .then((data) => {
          setUserData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [activeSection]);

  // Fetch events hosted by the user
  useEffect(() => {
    if (activeSection === 'events') {
      setLoading(true);
      fetch('/api/user/events', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch events');
          }
          return response.json();
        })
        .then((data) => {
          setEvents(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [activeSection]);

  const renderUserInfo = () => (
    <div className="content-section">
      <h2>User Information</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">Error: {error}</p>}
      {userData && !loading && !error && (
        <div className="user-details">
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Joined:</strong> {new Date(userData.joinDate).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );

  const renderEvents = () => (
    <div className="content-section">
      <h2>Events Hosted by You</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">Error: {error}</p>}
      {events.length > 0 && !loading && !error ? (
        <ul className="events-list">
          {events.map((event) => (
            <li key={event.id} className="event-item">
              <p><strong>{event.title}</strong></p>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Location: {event.location}</p>
              <p>Description: {event.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        !loading && !error && <p>No events found.</p>
      )}
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <div className="sidebar">
        <h1>Dashboard</h1>
        <nav>
          <button
            className={activeSection === 'userInfo' ? 'active' : ''}
            onClick={() => setActiveSection('userInfo')}
          >
            User Info
          </button>
          <button
            className={activeSection === 'events' ? 'active' : ''}
            onClick={() => setActiveSection('events')}
          >
            Events
          </button>
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>
      <div className="main-content">
        {activeSection === 'userInfo' ? renderUserInfo() : renderEvents()}
      </div>
    </div>
  );
};

export default LoginDashboard;