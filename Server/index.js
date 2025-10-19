require('dotenv').config();
const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const morgan      = require('morgan');

const connectDB    = require('./Connection/dbconnection');
const userRoute    = require('./Routes/userRoute');
const adminRoute   = require('./Routes/adminRoute');
const eventRoute   = require('./Routes/eventRoute');

const app = express();

// Connect to MongoDB
connectDB();

// Global Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes

app.use('/api', userRoute);
app.use('/api', adminRoute);

app.use('/api', eventRoute);

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: '🎉 Backend is up and running!' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

});