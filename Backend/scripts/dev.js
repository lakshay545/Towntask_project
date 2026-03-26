const { execSync, spawn } = require('child_process');

function killPort(port) {
  let output = '';

  try {
    output = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, { encoding: 'utf8' });
  } catch {
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
      console.log(`Cleared port ${port} (PID ${pid})`);
    } catch {
      // Ignore failures and continue launching the dev server.
    }
  }
}

killPort(5000);

const nodemonBin = require.resolve('nodemon/bin/nodemon');
const child = spawn(process.execPath, [nodemonBin, 'src/server.js'], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});