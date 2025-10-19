import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Person, Star } from '@mui/icons-material';
import './home.css'; import Footer from '../Footer/Footer';


const Home = () => {
  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.3 } },
    tap: { scale: 0.9 },
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <AppBar position="static" className="navbar">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NGO Platform
          </Typography>
          <Box display="flex" gap="1rem">
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <IconButton color="inherit" href="/logindashboard" className="nav-button">
                <Person />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  User
                </Typography>
              </IconButton>
            </motion.div>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <IconButton color="inherit" href="/features" className="nav-button">
                <Star />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  Features
                </Typography>
              </IconButton>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box className="hero-section" py={10}>
        <Container maxWidth="lg" style={{ textAlign: 'center' }}>
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <Typography variant="h2" className="hero-title" gutterBottom>
              Empowering Communities, Changing Lives
            </Typography>
            <Typography variant="h5" className="hero-subtitle" gutterBottom>
              Join us in making a difference through education, health, and sustainability.
            </Typography>

            <Box mt={4}>
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  href="/donate"
                >
                  Donate Now
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* About / Volunteer Section */}
      <Box className="about-section" py={8}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography variant="h4" gutterBottom>
                  Our Mission
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  We are dedicated to uplifting underserved communities by providing
                  access to quality education, healthcare, and sustainable development
                  programs. Our goal is to create lasting impact through compassion and
                  collaboration.
                </Typography>
                <Box mt={2}>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                      variant="outlined"
                      color="primary"
                      size="medium"
                      href="/volunteer"
                    >
                      Volunteer with Us
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.img
                src="https://via.placeholder.com/500x300?text=NGO+Impact"
                alt="NGO Impact"
                className="about-image"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Events Section (High Priority) */}
      <Box className="events-section" py={8} bgcolor="#f9f9f9">
        <Container maxWidth="md" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" gutterBottom>
              Upcoming Events
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Be at the heart of change—either create an event that inspires or join one
              already making an impact.
            </Typography>

            <Box mt={4} display="flex" justifyContent="center" gap="1rem">
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  href="/EventCreate"
                >
                  Create Event
                </Button>
              </motion.div>

              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  href="/EventJoin"
                >
                  Join Event
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* General Call to Action */}
      <Box className="cta-section" py={6}>
        <Container maxWidth="lg" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" gutterBottom>
              Get Involved Today
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Your support can transform lives. Join our mission to create a better future.
            </Typography>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                variant="contained"
                color="primary"
                size="large"
                href="/join"
              >
                Join Us
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
 
 <Footer/>   </div>
  );
};


export default Home;