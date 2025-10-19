import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { nanoid } from "nanoid";
import "./eventcreate.css";

const API_BASE_URL = import.meta.env.VITE_VITE_API_BASE_URL || "http://localhost:8000";

const initialEventState = {
  name: "",
  code: nanoid(8),
  date: null,
  location: "",
  description: "",
  category: "",
};

const EventCreate = () => {
  const [eventData, setEventData] = useState(initialEventState);
  const [loading, setLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});
  const calendarRef = useRef(null);

  useEffect(() => {
    if (calendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarOpen]);

  function handleClickOutside(e) {
    if (calendarRef.current && !calendarRef.current.contains(e.target)) {
      setCalendarOpen(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error for the field being edited
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function regenerateCode() {
    setEventData((prev) => ({ ...prev, code: nanoid(8) }));
  }

  function validateForm() {
    const newErrors = {};
    if (!eventData.name) newErrors.name = "Event name is required";
    if (!eventData.code) newErrors.code = "Event code is required";
    if (!eventData.date) newErrors.date = "Event date is required";
    if (!eventData.location) newErrors.location = "Location is required";
    if (!eventData.category) newErrors.category = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        ...eventData,
        date: eventData.date ? eventData.date.toISOString() : null,
      };
      const response = await axios.post(`${API_BASE_URL}/api/event`, payload);
      setMessage({ type: "success", text: response.data.message }); console.log("Event Created:", response.data);
      setEventData({ ...initialEventState, code: nanoid(8) });
      setErrors({});
    } catch (err) {
      const errorText = err.response?.data?.message || "Error creating event. Please try again.";
      setMessage({ type: "error", text: errorText });
    } finally {
      setLoading(false);
    }
  }

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };
  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.3 } },
    tap: { scale: 0.9 },
  };

  return (
    <Box className="eventcreate-container">
      {message.text && (
        <Box mb={2}>
          <Alert
            severity={message.type}
            onClose={() => setMessage({ type: "", text: "" })}
          >
            {message.text}
          </Alert>
        </Box>
      )}

      {/* Hero Section */}
      <Box className="hero-section" py={10}>
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <Typography variant="h2" gutterBottom>
              Create a New Event
            </Typography>
            <Typography variant="h5" gutterBottom>
              Organize impactful events to support sustainability and community
              engagement.
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
              <Typography variant="h5" gutterBottom>
                Create New Event
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Event Name"
                  name="name"
                  value={eventData.name}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors.name}
                  helperText={errors.name}
                />

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Event Code"
                    name="code"
                    value={eventData.code}
                    margin="normal"
                    InputProps={{ readOnly: true }}
                    error={!!errors.code}
                    helperText={errors.code}
                  />
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                      type="button"
                      variant="outlined"
                      size="small"
                      onClick={regenerateCode}
                    >
                      Regenerate
                    </Button>
                  </motion.div>
                </Box>

                <FormControl fullWidth margin="normal" required error={!!errors.category}>
                  <InputLabel id="category-label">Event Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    label="Event Category"
                    value={eventData.category}
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>Select a category</em>
                    </MenuItem>
                    <MenuItem value="Food Donation">Food Donation</MenuItem>
                    <MenuItem value="Tree Planting">Tree Planting</MenuItem>
                    <MenuItem value="Cleaning">Cleaning</MenuItem>
                  </Select>
                  {!!errors.category && (
                    <Typography color="error" variant="caption">
                      {errors.category}
                    </Typography>
                  )}
                </FormControl>

                <Box sx={{ position: "relative", mt: 2 }} ref={calendarRef}>
                  <TextField
                    fullWidth
                    label="Event Date"
                    name="date"
                    value={
                      eventData.date
                        ? format(eventData.date, "yyyy-MM-dd")
                        : ""
                    }
                    onClick={() => setCalendarOpen(true)}
                    margin="normal"
                    InputProps={{ readOnly: true }}
                    required
                    error={!!errors.date}
                    helperText={errors.date}
                  />
                  {calendarOpen && (
                    <Box className="calendar-popup">
                      <DayPicker
                        mode="single"
                        selected={eventData.date}
                        onSelect={(d) => {
                          setEventData((prev) => ({ ...prev, date: d }));
                          setErrors((prev) => ({ ...prev, date: "" }));
                          setCalendarOpen(false);
                        }}
                        disabled={{ before: new Date() }} // Disable past dates
                      />
                    </Box>
                  )}
                </Box>

                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={eventData.location}
                  onChange={handleChange}
                  margin="normal"
                  required
                  error={!!errors.location}
                  helperText={errors.location}
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={3}
                  value={eventData.description}
                  onChange={handleChange}
                  margin="normal"
                />

                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : "Create Event"}
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
export default EventCreate;