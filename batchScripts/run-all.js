#!/usr/bin/env node

/**
 * Run All Script - Starts Rule Engine, API, and Angular applications sequentially
 * 
 * This script will:
 * 1. Check if all dependencies are installed
 * 2. Start the API server (port 3000)
 * 3. Start the Angular UI (port 4200)
 * 4. Provide helpful status messages and URLs
 */

import { spawn, exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper function to colorize console output
function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

// Helper function to log with timestamp
function log(message, color = 'reset') {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${colorize(message, color)}`);
}

// Check if a directory exists and has package.json
function checkProject(dir) {
  const packagePath = path.join(dir, 'package.json');
  return fs.existsSync(packagePath);
}

// Check if node_modules exists
function checkDependencies(dir) {
  const nodeModulesPath = path.join(dir, 'node_modules');
  return fs.existsSync(nodeModulesPath);
}

// Main execution function
async function runAll() {
  console.log(colorize('\n🚀 Playwright Automation Engine - Starting All Services', 'cyan'));
  console.log(colorize('=' .repeat(60), 'cyan'));
  
  const projectRoot = process.cwd();
  
  // Check project structure
  log('📁 Checking project structure...', 'blue');
  
  const checks = [
    { name: 'Main Project', path: projectRoot, required: true },
    { name: 'API Server', path: path.join(projectRoot, 'api'), required: true },
    { name: 'Angular UI', path: path.join(projectRoot, 'autobot-ui'), required: true }
  ];
  
  for (const check of checks) {
    if (!checkProject(check.path)) {
      log(`❌ ${check.name} not found at ${check.path}`, 'red');
      if (check.required) {
        log('💡 Make sure you\'re running this script from the project root directory', 'yellow');
        process.exit(1);
      }
    } else {
      log(`✅ ${check.name} found`, 'green');
    }
  }
  
  // Check dependencies
  log('\n📦 Checking dependencies...', 'blue');
  
  const dependencyChecks = [
    { name: 'Main Project', path: projectRoot },
    { name: 'API Server', path: path.join(projectRoot, 'api') },
    { name: 'Angular UI', path: path.join(projectRoot, 'autobot-ui') }
  ];
  
  for (const check of dependencyChecks) {
    if (!checkDependencies(check.path)) {
      log(`⚠️  ${check.name} dependencies not installed`, 'yellow');
      log(`   Run: cd ${path.relative(projectRoot, check.path)} && npm install`, 'yellow');
    } else {
      log(`✅ ${check.name} dependencies installed`, 'green');
    }
  }
  
  // Check Playwright browsers
  log('\n🌐 Checking Playwright browsers...', 'blue');
  
  try {
    const { stdout } = await new Promise((resolve, reject) => {
      exec('npx playwright --version', (error, stdout, stderr) => {
        if (error) reject(error);
        else resolve({ stdout, stderr });
      });
    });
    log(`✅ Playwright installed: ${stdout.trim()}`, 'green');
  } catch (error) {
    log('⚠️  Playwright not found or browsers not installed', 'yellow');
    log('   Run: npm run install-browsers', 'yellow');
  }
  
  console.log(colorize('\n🎯 Starting Services...', 'magenta'));
  console.log(colorize('=' .repeat(40), 'magenta'));
  
  // Start API Server
  log('🚀 Starting API Server (Port 3000)...', 'blue');
  
  const apiProcess = spawn('npm', ['start'], {
    cwd: path.join(projectRoot, 'api'),
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true
  });
  
  // Handle API server output
  apiProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output.includes('API server running')) {
      log('✅ API Server started successfully!', 'green');
    } else if (output.includes('WebSocket server running')) {
      log('✅ WebSocket server started!', 'green');
    } else if (output) {
      log(`[API] ${output}`, 'cyan');
    }
  });
  
  apiProcess.stderr.on('data', (data) => {
    const error = data.toString().trim();
    if (error) {
      log(`[API Error] ${error}`, 'red');
    }
  });
  
  // Wait for API server to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Start Angular UI
  log('\n🎨 Starting Angular UI (Port 4200)...', 'blue');
  
  const angularProcess = spawn('npm', ['run', 'start'], {
    cwd: path.join(projectRoot, 'autobot-ui'),
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true
  });
  
  // Handle Angular output
  angularProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output.includes('Local:')) {
      log('✅ Angular UI started successfully!', 'green');
    } else if (output.includes('webpack compiled')) {
      log('✅ Angular compilation completed!', 'green');
    } else if (output) {
      log(`[Angular] ${output}`, 'cyan');
    }
  });
  
  angularProcess.stderr.on('data', (data) => {
    const error = data.toString().trim();
    if (error && !error.includes('DeprecationWarning')) {
      log(`[Angular Error] ${error}`, 'red');
    }
  });
  
  // Wait for Angular to start
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // Success message
  console.log(colorize('\n🎉 All Services Started Successfully!', 'green'));
  console.log(colorize('=' .repeat(50), 'green'));
  
  log('📱 Angular UI: http://localhost:4200', 'bright');
  log('🔌 API Server: http://localhost:3000', 'bright');
  log('📡 WebSocket: ws://localhost:8081', 'bright');
  
  console.log(colorize('\n📋 Available Commands:', 'yellow'));
  log('• Create automation rules: Use the Rule Builder in Angular UI', 'yellow');
  log('• Run existing rules: Click "Run" in the Dashboard', 'yellow');
  log('• View logs: Real-time logs in the Dashboard', 'yellow');
  log('• Download logs: Click "Download Logs" button', 'yellow');
  
  console.log(colorize('\n🛑 To stop all services: Press Ctrl+C', 'red'));
  
  // Handle process termination
  process.on('SIGINT', () => {
    log('\n🛑 Shutting down all services...', 'yellow');
    
    apiProcess.kill('SIGTERM');
    angularProcess.kill('SIGTERM');
    
    setTimeout(() => {
      log('✅ All services stopped. Goodbye! 👋', 'green');
      process.exit(0);
    }, 2000);
  });
  
  // Keep the process alive
  process.stdin.resume();
}

// Error handling
process.on('uncaughtException', (error) => {
  log(`❌ Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`❌ Unhandled rejection at: ${promise}, reason: ${reason}`, 'red');
  process.exit(1);
});

// Run the script
runAll().catch(error => {
  log(`❌ Failed to start services: ${error.message}`, 'red');
  process.exit(1);
});