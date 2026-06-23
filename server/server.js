require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const emailRoutes = require('./routes/emailRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
// Establish database connection
connectDB();

const app = express();

// Standard middlewares
app.use(cors({
  origin: '*', // In production, restrict to your client domain
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to check database connection status for API routes
app.use('/api', (req, res, next) => {
  if (req.path === '/ping' || req.path === '/health') {
    return next();
  }
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection is not established. Please check your MONGODB_URI configuration and verify your MongoDB Atlas IP Whitelisting (ensure 0.0.0.0/0 is whitelisted for Render dynamic IPs).',
    });
  }
  next();
});

// Serve API routes
app.use('/api/auth', authRoutes);
console.log('Auth routes mounted at /api/auth');
app.use('/api/email', emailRoutes);
console.log('Email routes mounted at /api/email');

// Base route checker
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy and running.' });
});

app.get('/api/ping', (req, res) => {
  console.log('Health and ping routes are set up');
  res.status(200).json({ success: true, message: 'pong' });
});

// Serve frontend in production (static assets from client/dist)
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// Fallback for SPA routing in production
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
    if (err) {
      // If client build is not created yet, show standard greeting
      res.status(200).send('API is running. Client build not found (serve dev client separately).');
    }
  });
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server executing in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
