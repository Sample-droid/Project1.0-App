import React, { useState, useEffect } from 'react';
import {
  
  
  Container,
 
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  
  CircularProgress, Box
} from '@mui/material';
import { Link } from 'react-router-dom';

const EventJoin = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/events', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch events: ${res.status} ${text}`);
        }
        const data = await res.json();
        if (mounted) setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load events');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchEvents();
    return () => { mounted = false };
  }, []);

  if (loading) {
    return (
      <Container className="event-join__container">
        <Typography variant="h4" align="center" className="event-join__header">
          Current Events
        </Typography>
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="event-join__container">
        <Typography variant="h4" align="center" className="event-join__header">
          Current Events
        </Typography>
        <Typography color="error" align="center" mt={2}>
          {error}
        </Typography>
      </Container>
    );
  }

  if (events.length === 0) {
    return (
      <Container className="event-join__container">
        <Typography variant="h4" align="center" className="event-join__header">
          Current Events
        </Typography>
        <Typography align="center" mt={2}>
          No events available.
        </Typography>
      </Container>
    );
  }

  return (
    <Container className="event-join__container">
      <Typography variant="h4" align="center" className="event-join__header">
        Current Events
      </Typography>

      <Grid container spacing={4} mt={2}>
        {events.map(evt => (
          <Grid item xs={12} sm={6} md={4} key={evt.id || evt._id}>
            <Card className="event-card">
              <CardContent>
                <Typography variant="h5" className="event-card__title">
                  {evt.name}
                </Typography>
                <Typography variant="body2" className="event-card__meta">
                  {evt.date
                    ? new Date(evt.date).toLocaleDateString()
                    : 'Date TBA'}{' '}
                  | {evt.location || 'Location TBA'}
                </Typography>
                <Typography variant="body2" className="event-card__desc">
                  {evt.description || ''}
                </Typography>
              </CardContent>

              <CardActions className="event-card__actions">
                <Button
                  component={Link}
                  to={`/join/${evt.id || evt._id}`}
                  variant="outlined"
                  className="event-card__button"
                >
                  Join Event
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EventJoin;