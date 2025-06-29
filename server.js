require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// CORS setup
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  exposedHeaders: ['x-csrf-token']
}));

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const menuRoutes = require('./routes/menuRoutes');
const userRoutes = require('./routes/userRoutes');

// CSRF protection khusus admin
const adminCsrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production' ? true : false
  }
});

// CSRF token endpoint khusus admin (harus sebelum middleware CSRF)
app.get('/api/admin/csrf-token', (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: 'strict',
    httpOnly: false
  });
  res.json({ csrfToken: req.csrfToken() });
});

// Admin routes dengan CSRF
app.use('/api/admin', adminCsrfProtection, adminRoutes);

// Public routes tanpa CSRF
app.use('/api/menus', menuRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      status: 'error',
      message: 'Invalid CSRF token'
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
