/**
 * RailGaadi Permanent Background Server Launcher
 *
 * This script is run by Windows Task Scheduler at every login.
 * It starts both the backend (Fastify) and frontend (Vite) as child processes,
 * and automatically restarts either one if it exits for any reason.
 *
 * All output goes to D:\RailGaadi\logs\ for debugging.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = 'D:\\RailGaadi';
const NODE = 'D:\\Program Files\\nodejs\\node.exe';
// Use npm-cli.js directly so no shell is needed (avoids npm.cmd / shell issues)
const NPM_CLI = 'D:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npm-cli.js';
const LOG_DIR = path.join(ROOT, 'logs');

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

function ts() {
  return new Date().toISOString();
}

function openLog(name) {
  // Rotate: keep last 500 KB
  const file = path.join(LOG_DIR, `${name}.log`);
  try {
    const stat = fs.statSync(file);
    if (stat.size > 512 * 1024) {
      fs.renameSync(file, file + '.old');
    }
  } catch { /* first run */ }
  return fs.createWriteStream(file, { flags: 'a' });
}

function log(stream, msg) {
  const line = `[${ts()}] ${msg}\n`;
  process.stdout.write(line);
  try { stream.write(line); } catch { /* stream closed */ }
}

/**
 * Start a process and unconditionally restart it if it exits.
 */
function spawnPermanent({ name, executable, args, cwd, env, restartDelay }) {
  const logStream = openLog(name);

  function start() {
    log(logStream, `Starting: ${executable} ${args.join(' ')}`);

    let proc;
    try {
      proc = spawn(executable, args, {
        cwd,
        env: { ...process.env, ...env },
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
        shell: false,
      });
    } catch (spawnErr) {
      log(logStream, `spawn() threw: ${spawnErr.message} — retrying in ${restartDelay}ms`);
      setTimeout(start, restartDelay);
      return;
    }

    proc.stdout.on('data', (d) => logStream.write(`[${ts()}] OUT: ${d}`));
    proc.stderr.on('data', (d) => logStream.write(`[${ts()}] ERR: ${d}`));

    proc.on('exit', (code, signal) => {
      log(logStream, `Exited (code=${code} signal=${signal}) — restarting in ${restartDelay}ms`);
      setTimeout(start, restartDelay);
    });

    proc.on('error', (err) => {
      log(logStream, `Process error: ${err.message} — restarting in ${restartDelay}ms`);
      setTimeout(start, restartDelay);
    });
  }

  // Stagger the two servers so they don't race on startup
  start();
}

const mainLog = openLog('launcher');
log(mainLog, '====== RailGaadi Launcher Started ======');
log(mainLog, `NODE  : ${NODE}`);
log(mainLog, `NPM   : ${NPM_CLI}`);
log(mainLog, `ROOT  : ${ROOT}`);

// ─── Backend — Fastify API server on :3001 ────────────────────────────────────
spawnPermanent({
  name: 'backend',
  executable: NODE,
  args: ['dist/index.js'],
  cwd: path.join(ROOT, 'backend'),
  env: { NODE_ENV: 'production', PORT: '3001' },
  restartDelay: 3000,
});

// Wait 4 seconds before starting the frontend so the backend has time to boot
setTimeout(() => {
  // ─── Frontend — Vite dev server on :5173 ──────────────────────────────────
  spawnPermanent({
    name: 'frontend',
    executable: NODE,
    // Invoke npm run dev via npm-cli.js (pure-node, no shell needed on Windows)
    args: [NPM_CLI, 'run', 'dev', '--', '--port', '5173', '--host'],
    cwd: path.join(ROOT, 'frontend'),
    env: { NODE_ENV: 'development' },
    restartDelay: 5000,
  });
  log(mainLog, 'Frontend launcher started');
}, 4000);

log(mainLog, 'Launcher running — monitoring both servers for crashes...');

// Keep the event loop alive indefinitely
setInterval(() => {}, 60000);

process.on('uncaughtException', (err) => {
  log(mainLog, `uncaughtException: ${err.message}\n${err.stack}`);
});
process.on('unhandledRejection', (r) => {
  log(mainLog, `unhandledRejection: ${r}`);
});
