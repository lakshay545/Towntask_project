const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 9999;
const FRONTEND_DIR = path.resolve(__dirname, '..');

console.log('🧹 Starting TownTask Frontend Development Server Cleanup...\n');

// Function to sleep for a given milliseconds (synchronous)
function sleepSync(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // Busy wait
  }
}

// Function to kill processes on a specific port
function killPort(port) {
  console.log(`🔫 Checking for processes on port ${port}...`);
  let output = '';

  try {
    output = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, { encoding: 'utf8' });
  } catch {
    console.log(`✓ Port ${port} is free`);
    return;
  }

  const pids = [...new Set(
    output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.split(/\s+/).pop())
      .filter((pid) => /^\d+$/.test(pid))
  )];

  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
      console.log(`✓ Cleared port ${port} (PID ${pid})`);
    } catch {
      // Ignore failures and continue
    }
  }
}

// Function to remove directories recursively
function removeDir(dirPath, description) {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✓ Removed ${description}: ${dirPath}`);
    }
  } catch (err) {
    console.warn(`⚠ Could not remove ${description}: ${err.message}`);
  }
}

// Step 1: Kill port
killPort(PORT);
killPort(5173); // Also kill old port in case it's running

// Step 2: Clear Vite cache
console.log('\n🗑️ Clearing Vite caches...');
const nodeModulesPath = path.join(FRONTEND_DIR, 'node_modules');
const viteCachePath = path.join(nodeModulesPath, '.vite');
removeDir(viteCachePath, 'Vite cache');

// Step 3: Clear dist folder
console.log('\n🏗️ Clearing build artifacts...');
const distPath = path.join(FRONTEND_DIR, 'dist');
removeDir(distPath, 'dist folder');

// Step 4: Wait a moment for files to be released
console.log('\n⏳ Waiting for system to release file locks...');
sleepSync(2000);

console.log('\n✨ Cleanup complete! Starting development server on port ' + PORT + '...\n');
console.log('📍 Access your app at: http://localhost:' + PORT);
console.log('💡 Press Ctrl+C to stop the server\n');

// Step 5: Launch Vite dev server
const child = spawn('npx', ['vite', '--port', PORT.toString()], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});