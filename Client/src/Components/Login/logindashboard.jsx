import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './logindashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
      axios
        .get(`${API_BASE_URL}/api`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          if (response.data.success) {
            setUserData(response.data.user);
            setLoading(false);
          } else {
            throw new Error(response.data.message || 'Failed to fetch user data');
          }
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'Error fetching user data');
          setLoading(false);
        });
    }
  }, [activeSection]);

  // Fetch events hosted by the user
  useEffect(() => {
    if (activeSection === 'events') {
      setLoading(true);
      axios
        .get(`${API_BASE_URL}/api/user/events`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          if (response.data.success) {
            setEvents(response.data.events);
            setLoading(false);
          } else {
            throw new Error(response.data.message || 'Failed to fetch events');
          }
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'Error fetching events');
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
            <li key={event._id} className="event-item">
              <p><strong>{event.name}</strong></p>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Location: {event.location}</p>
              <p>Description: {event.description || 'No description provided'}</p>
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