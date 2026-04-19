#!/usr/bin/env node

/**
 * Local Development Setup Script for Unikart
 * 
 * This script helps set up the local development environment
 * for both frontend and backend.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Unikart Local Development Setup');
console.log('=====================================\n');

// Check if we're in the right directory
const currentDir = process.cwd();
const packageJsonPath = path.join(currentDir, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json not found. Please run this script from the project root directory.');
  process.exit(1);
}

console.log('✅ Project root detected');
console.log(`📁 Current directory: ${currentDir}\n`);

// Function to check if a command exists
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Check prerequisites
console.log('🔍 Checking prerequisites...\n');

const checks = [
  { name: 'Node.js', command: 'node --version', required: true },
  { name: 'npm', command: 'npm --version', required: true },
  { name: 'PostgreSQL', command: 'psql --version', required: false },
  { name: 'Docker', command: 'docker --version', required: false }
];

checks.forEach(check => {
  try {
    const result = execSync(check.command, { encoding: 'utf8' }).trim();
    console.log(`✅ ${check.name}: ${result}`);
  } catch (error) {
    if (check.required) {
      console.log(`❌ ${check.name}: Not found (required)`);
      process.exit(1);
    } else {
      console.log(`⚠️  ${check.name}: Not found (optional)`);
    }
  }
});

console.log('\n📦 Setting up backend...\n');

// Setup backend
const backendDir = path.join(currentDir, 'src', 'backend');

if (fs.existsSync(backendDir)) {
  process.chdir(backendDir);
  console.log(`📁 Changed to backend directory: ${backendDir}`);
  
  // Install dependencies
  console.log('📦 Installing backend dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Backend dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install backend dependencies');
    process.exit(1);
  }
  
  // Create .env file if it doesn't exist
  const envExamplePath = path.join(backendDir, '.env.example');
  const envPath = path.join(backendDir, '.env');
  
  if (fs.existsSync(envExamplePath) && !fs.existsSync(envPath)) {
    console.log('📝 Creating .env file from template...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created');
    console.log('⚠️  Please edit .env file with your database credentials');
  } else if (fs.existsSync(envPath)) {
    console.log('✅ .env file already exists');
  }
  
  // Check if database setup script exists
  const setupScript = path.join(backendDir, 'deployment', 'setup_database.js');
  if (fs.existsSync(setupScript)) {
    console.log('💡 Database setup script available at: deployment/setup_database.js');
  }
} else {
  console.error('❌ Backend directory not found');
  process.exit(1);
}

console.log('\n📦 Setting up frontend...\n');

// Setup frontend
const frontendDir = path.join(currentDir, 'src', 'frontend');

if (fs.existsSync(frontendDir)) {
  process.chdir(frontendDir);
  console.log(`📁 Changed to frontend directory: ${frontendDir}`);
  
  // Install dependencies
  console.log('📦 Installing frontend dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Frontend dependencies installed');
  } catch (error) {
    console.error('❌ Failed to install frontend dependencies');
    process.exit(1);
  }
  
  // Check if .env.local exists
  const envLocalPath = path.join(frontendDir, '.env.local');
  if (!fs.existsSync(envLocalPath)) {
    console.log('📝 Creating .env.local file...');
    fs.writeFileSync(envLocalPath, 'VITE_API_URL=http://localhost:5000/api\n');
    console.log('✅ .env.local file created');
  } else {
    console.log('✅ .env.local file already exists');
  }
} else {
  console.error('❌ Frontend directory not found');
  process.exit(1);
}

console.log('\n🎉 Setup complete!\n');

console.log('📋 Next steps:');
console.log('1. Configure your database credentials in src/backend/.env');
console.log('2. Set up your PostgreSQL database');
console.log('3. Run the database setup script: node src/backend/deployment/setup_database.js');
console.log('4. Start the backend: cd src/backend && npm start');
console.log('5. Start the frontend: cd src/frontend && npm run dev');
console.log('6. Open http://localhost:5173 in your browser\n');

console.log('🔗 Useful commands:');
console.log('Backend: cd src/backend && npm start');
console.log('Frontend: cd src/frontend && npm run dev');
console.log('Backend Tests: cd src/backend && npm test');
console.log('Frontend Tests: cd src/frontend && npm test');
console.log('Integration Tests: cd src/frontend && node src/tests/IntegrationTests.js\n');

console.log('📚 Documentation:');
console.log('- Local Development: docs/LOCAL_DEVELOPMENT_SETUP.md');
console.log('- AWS SNS/SES Setup: docs/AWS_SNS_SES_SETUP.md');
console.log('- Project Overview: docs/README_COMPLETE.md\n');

console.log('Happy coding! 🚀');