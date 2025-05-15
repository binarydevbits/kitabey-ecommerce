// Vercel serverless API file
const app = require('../server');

// Add basic error handling to prevent server crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

// Export the Express app as a serverless function
module.exports = app; 