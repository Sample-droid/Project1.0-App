import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { motion } from 'framer-motion';
import './EventJoin.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const EventJoin = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from the backend using axios
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/events`);
        if (response.data.success) {
          // Filter events to show only present or future events
          const currentEvents = response.data.events.filter(
            (event) => new Date(event.date) >= new Date()
          );
          setEvents(currentEvents);
        } else {
          throw new Error('Failed to fetch events');
        }
      } catch (err) {
        const errorText = err.response?.data?.message || 'Error fetching events. Please try again.';
        setError(errorText);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="event-join-container">
      <Box className="header-section" py={6}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography variant="h3" className="header-title" gutterBottom>
              Join Our Events
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Participate in our upcoming events to make a difference in the community.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Box className="events-section" py={4}>
        <Container maxWidth="lg">
          {loading && (
            <Typography variant="h6" align="center">
              Loading events...
            </Typography>
          )}
          {error && (
            <Typography variant="h6" align="center" color="error">
              {error}
            </Typography>
          )}
          {!loading && !error && events.length === 0 && (
            <Typography variant="h6" align="center">
              No upcoming events available.
            </Typography>
          )}
          <Grid container spacing={4}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Card className="event-card">
                    <CardContent>
                      <Typography variant="h5" className="event-title" gutterBottom>
                        {event.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Location:</strong> {event.location}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Category:</strong> {event.category}
                      </Typography>
                      <Typography variant="body1" className="event-description" mt={2}>
                        {event.description || 'No description provided.'}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        href={`/join-event/${event._id}`}
                        className="join-button"
                      >
                        Join
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </div>
  );
};



export default EventJoin;