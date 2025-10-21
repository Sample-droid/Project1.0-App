import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import "./Donation.css";
const Donation = () => {
  
  
  
  
    const baseurl = import.meta.env.VITE_API_BASE_URL;
  const stripe = useStripe();
  const elements = useElements();
  const [donation, setDonation] = useState({
    amount: "",
    customAmount: "",
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) =>
    setDonation((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setDonation((prev) => ({
      ...prev,
      amount: value,
      customAmount: value === "custom" ? prev.customAmount : "",
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(null);

  if (!stripe || !elements) {
    setError("Payment processing is not available. Please try again later.");
    setLoading(false);
    return;
  }

  // ---- CHANGED: compute the raw amount from selected or custom field ----
  const rawAmount =
    donation.amount === "custom" ? donation.customAmount : donation.amount;
  const numericAmount = parseFloat(rawAmount); // parse to number

  if (!rawAmount || isNaN(numericAmount) || numericAmount <= 0) {
    setError("Please select or enter a valid donation amount.");
    setLoading(false);
    return;
  }
  // ---------------------------------------------------------------

  // ---- CHANGED: convert dollars to cents (integer) for backend/Stripe ----
  const amountInCents = Math.round(numericAmount * 100);
  // --------------------------------------------------------------------

  try {
    // ---- CHANGED: send the correct payload using amountInCents (not undefined `amount`) ----
    
    
    

    const response = await fetch(`${baseurl}/api/donations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amountInCents, // integer cents expected by backend
        currency: "usd",
        name: donation.name,
        email: donation.email,
        message: donation.message,
      }),
    });
    // -------------------------------------------------------------------------------

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || "Failed to create payment intent");
    }

    const { clientSecret } = await response.json();

    if (!clientSecret) {
      throw new Error("Missing clientSecret from server response");
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: donation.name,
          email: donation.email,
        },
      },
    });

    if (result.error) {
      setError(result.error.message || "Payment failed");
    } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
      setSuccess("Thank you for your donation!");
      setDonation({
        amount: "",
        customAmount: "",
        name: "",
        email: "",
        message: "",
      });
      const card = elements.getElement(CardElement);
      if (card && card.clear) card.clear();
    } else {
      setError("Payment was not completed. Please try again.");
    }
  } catch (err) {
    setError(err.message || "An unexpected error occurred");
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.3 } },
    tap: { scale: 0.9 },
  };

  return (
    <Box className="donation-container">
      {/* Hero Section */}
      <Box className="hero-section" py={10}>
        <Container maxWidth="lg" style={{ textAlign: "center" }}>
          <motion.div variants={heroVariants} initial="hidden" animate="visible">
            <Typography variant="h2" className="hero-title" gutterBottom>
              Support Our Mission
            </Typography>
            <Typography variant="h5" className="hero-subtitle" gutterBottom>
              Your donation helps us build sustainable communities and promote well-being.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Form Section */}
      <Box className="form-section" py={8}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box className="form-card">
              <Typography variant="h5" className="form-title" gutterBottom>
                Make a Donation
              </Typography>
              {error && (
                <Box sx={{ mb: 2 }}>
                  <Alert severity="error">{error}</Alert>
                </Box>
              )}
              {success && (
                <Box sx={{ mb: 2 }}>
                  <Alert severity="success">{success}</Alert>
                </Box>
              )}
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Donation Amount</InputLabel>
                  <Select
                    name="amount"
                    value={donation.amount}
                    onChange={handleAmountChange}
                    className="form-input"
                    required
                  >
                    <MenuItem value="">Select an amount</MenuItem>
                    <MenuItem value="10">$10</MenuItem>
                    <MenuItem value="25">$25</MenuItem>
                    <MenuItem value="50">$50</MenuItem>
                    <MenuItem value="100">$100</MenuItem>
                    <MenuItem value="custom">Custom Amount</MenuItem>
                  </Select>
                </FormControl>
                {donation.amount === "custom" && (
                  <TextField
                    fullWidth
                    label="Custom Amount ($)"
                    name="customAmount"
                    value={donation.customAmount}
                    onChange={handleChange}
                    margin="normal"
                    type="number"
                    inputProps={{ min: 1, step: "0.01" }}
                    required
                    className="form-input"
                  />
                )}
                <TextField
                  fullWidth
                  label="Your Name"
                  name="name"
                  value={donation.name}
                  onChange={handleChange}
                  margin="normal"
                  required
                  className="form-input"
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={donation.email}
                  onChange={handleChange}
                  margin="normal"
                  required
                  className="form-input"
                />
                <Box sx={{ mt: 2, mb: 2 }}>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#374151",
                          fontFamily: "'Inter', sans-serif",
                          "::placeholder": { color: "#9ca3af" },
                        },
                        invalid: { color: "#b91c1c" },
                      },
                    }}
                    className="stripe-card-input"
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Message (Optional)"
                  name="message"
                  multiline
                  rows={3}
                  value={donation.message}
                  onChange={handleChange}
                  margin="normal"
                  className="form-input"
                />
                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading || !stripe || !elements}
                      className="submit-button"
                    >
                      {loading ? <CircularProgress size={24} /> : "Donate Now"}
                    </Button>
                  </motion.div>
                </Box>
              </form>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Donation;