import React, { useState } from 'react';
import { Container, Paper, Box, Typography, TextField, Button, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const baseurl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        username: credentials.username,
        password: credentials.password
      };

      const res = await axios.post(`${baseurl}/api/login`, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      // axios resolves non-2xx responses as rejections, so here res is a successful response
      const data = res.data;

      // Example: backend returns { success: true, token: '...', message: '...' }
      if (data && data.success === false) {
        throw new Error(data.message || 'Login failed');
      }

      // Optionally store token if returned
      if (data && data.token) {
        localStorage.setItem('token', data.token);
      }

      navigate('/home');
    } catch (err) {
      // err may be an AxiosError with response data
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        setError(err.response.data.message || JSON.stringify(err.response.data));
      } else {
        setError(err.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Sign In
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            name="username"
            label="Username"
            value={credentials.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            name="password"
            label="Password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </Button>
        </Box>

        <Typography align="center" sx={{ mt: 2 }}>
          Don’t have an account?{' '}
          <Link component={RouterLink} to="/signup" underline="hover">
            Signup
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;