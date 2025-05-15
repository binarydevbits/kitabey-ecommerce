// Custom build script for Vercel
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting custom Vercel build process...');

// Set environment variables for build
process.env.CI = 'false';
process.env.NODE_ENV = 'production';

try {
  // Run the build command
  console.log('Running React build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Verify the build was created
  const buildDir = path.join(__dirname, 'build');
  if (fs.existsSync(buildDir)) {
    console.log('Build directory exists:', fs.readdirSync(buildDir));
  } else {
    console.error('Build directory was not created!');
    process.exit(1);
  }
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 