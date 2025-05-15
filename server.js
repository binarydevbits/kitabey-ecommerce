const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file in development
// In production/Vercel, use Vercel environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '.env') });
}

// Check if required environment variables are set
const isEmailConfigured = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
const isAdminEmailConfigured = Boolean(process.env.ADMIN_EMAIL);

console.log('Email Configuration Status:', {
  emailConfigured: isEmailConfigured,
  adminEmailConfigured: isAdminEmailConfigured
});

// Import API routes
let emailRoutes, adminRoutes;
try {
  emailRoutes = require('./src/api/emailApi.js');
  adminRoutes = require('./src/api/adminApi.js');
} catch (error) {
  console.error('Error loading API routes:', error.message);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route to confirm API is running
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// API Routes - only add if successfully loaded
if (emailRoutes) {
  app.use('/api/email', emailRoutes);
  console.log('Email API routes registered');
}

if (adminRoutes) {
  app.use('/api/admin', adminRoutes);
  console.log('Admin API routes registered');
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: process.env.NODE_ENV === 'development' ? err.message : null });
});

// Serve static files for production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from build folder
  const buildPath = path.join(__dirname, 'build');
  if (require('fs').existsSync(buildPath)) {
    app.use(express.static(buildPath));
    
    // Catch-all route to serve index.html for client-side routing
    app.get('*', (req, res, next) => {
      // Skip API routes
      if (req.path.startsWith('/api/')) {
        return next();
      }
      
      res.sendFile(path.join(buildPath, 'index.html'));
    });
    console.log('Serving static files from', buildPath);
  } else {
    console.warn('Build folder not found:', buildPath);
  }
}

// Start server in development mode
if (process.env.NODE_ENV === 'development') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel serverless functions
module.exports = app; 