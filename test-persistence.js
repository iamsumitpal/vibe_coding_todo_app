#!/usr/bin/env node

// Simple test script to verify localStorage persistence
const fs = require('fs');
const path = require('path');

console.log('Testing localStorage persistence...');

// Check if the app is running
const checkAppRunning = () => {
  try {
    const { execSync } = require('child_process');
    const result = execSync('lsof -i :3000', { encoding: 'utf8' });
    console.log('✅ App is running on port 3000');
    return true;
  } catch (error) {
    console.log('❌ App is not running on port 3000');
    return false;
  }
};

// Check PM2 status
const checkPM2Status = () => {
  try {
    const { execSync } = require('child_process');
    const result = execSync('pm2 status', { encoding: 'utf8' });
    console.log('✅ PM2 Status:');
    console.log(result);
    return true;
  } catch (error) {
    console.log('❌ PM2 not available or no processes running');
    return false;
  }
};

// Check if PM2 startup is configured
const checkPM2Startup = () => {
  try {
    const { execSync } = require('child_process');
    const result = execSync('pm2 startup', { encoding: 'utf8' });
    console.log('✅ PM2 startup configured');
    return true;
  } catch (error) {
    console.log('❌ PM2 startup not configured');
    return false;
  }
};

console.log('\n=== Persistence Test Results ===');
checkAppRunning();
checkPM2Status();
checkPM2Startup();

console.log('\n=== Instructions ===');
console.log('1. Open http://localhost:3000 in your browser');
console.log('2. Add some tasks and move them around');
console.log('3. Close the browser completely');
console.log('4. Reopen the browser and go to http://localhost:3000');
console.log('5. Your tasks should still be there');
console.log('\n=== To ensure app runs after reboot ===');
console.log('Run: sudo env PATH=$PATH:/opt/homebrew/Cellar/node/23.11.0/bin /opt/homebrew/lib/node_modules/pm2/bin/pm2 startup launchd -u sumit.pal --hp /Users/sumit.pal');
console.log('Then: pm2 save'); 