/**
 * RailGaadi Frontend Launcher for PM2 on Windows
 * Spawns Vite via npm script so Windows shell handles .cmd resolution.
 */
const { spawn } = require('child_process');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');

console.log('[RailGaadi Frontend] Starting Vite dev server...');

const proc = spawn('npm', ['run', 'dev', '--', '--port', '5173', '--host'], {
  cwd: frontendDir,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NODE_ENV: 'development' },
});

proc.on('error', (err) => {
  console.error('[RailGaadi Frontend] Failed to start:', err.message);
  process.exit(1);
});

proc.on('exit', (code) => {
  console.log('[RailGaadi Frontend] Exited with code:', code);
  process.exit(code ?? 0);
});

process.on('SIGTERM', () => proc.kill('SIGTERM'));
process.on('SIGINT', () => proc.kill('SIGINT'));
