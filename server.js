const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file in development
// In production/Vercel, use Vercel environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '.env') });
}

// Verify environment variables without logging credentials
console.log('Email Configuration:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Configured' : 'Not configured');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL ? 'Configured' : 'Not configured');

const emailRoutes = require('./src/api/emailApi.js');
const adminRoutes = require('./src/api/adminApi.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/email', emailRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return;
    }
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Test route to confirm API is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!', env: process.env.NODE_ENV });
});

// Start server in development mode
if (process.env.NODE_ENV === 'development') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app; 