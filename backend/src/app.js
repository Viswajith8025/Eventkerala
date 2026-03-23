const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Route files
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const placeRoutes = require('./routes/placeRoutes');
const messageRoutes = require('./routes/messageRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount routers
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/places', placeRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Routes
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'EventKerala API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;
