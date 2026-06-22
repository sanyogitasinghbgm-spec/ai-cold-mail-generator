require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
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
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve API routes
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);

// Base route checker
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy and running.' });
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
