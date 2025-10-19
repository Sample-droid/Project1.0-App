const express = require('express');
const router = express.Router();


const Event = require('../Model/Event');
router.post('/event', async (req, res, next) => {
  try {
    const { name, code, date, location, description, category } = req.body;

    // Validate required fields
    if (!name || !code || !date || !location || !category) {
      const error = new Error('All required fields (name, code, date, location, category) must be provided');
      error.status = 400;
      throw error;
    }

    // Validate category
    const validCategories = ['Food Donation', 'Tree Planting', 'Cleaning'];
    if (!validCategories.includes(category)) {
      const error = new Error('Invalid category. Must be one of: Food Donation, Tree Planting, Cleaning');
      error.status = 400;
      throw error;
    }

    // Validate code length
    if (code.length !== 8) {
      const error = new Error('Event code must be exactly 8 characters');
      error.status = 400;
      throw error;
    }

    // Check for unique event code
    const existingEvent = await Event.findOne({ code });
    if (existingEvent) {
      const error = new Error('Event code already exists');
      error.status = 400;
      throw error;
    }

    // Create new event
    const newEvent = new Event({
      name,
      code,
      date: new Date(date),
      location,
      description: description || '',
      category
    });

    // Save event to database
    const savedEvent = await newEvent.save();
    res.status(201).json({
      success: true,
    
    
      message: 'Event created successfully',
      event: savedEvent
    });
  } catch (error) {
    next(error); // Pass to global error handler
  }
});

// GET route to list all events
router.get('/events', async (req, res, next) => {
  try {
    const events = await Event.find()
      .select('name code date location description category')
      .sort({ date: 1 });
    res.status(200).json({
      success: true,
      message: 'Events retrieved successfully',
      events
    });
  } catch (error) {
    next(error); // Pass to global error handler
  }
});
module.exports = router;