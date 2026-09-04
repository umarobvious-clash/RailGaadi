// PM2 Ecosystem Configuration for RailGaadi (Windows-compatible)
// Both processes are managed by PM2 with auto-restart on crash.

module.exports = {
  apps: [
    // ─── Backend: Fastify API Server (compiled JS) ────────────────────────────
    {
      name: 'railgaadi-backend',
      cwd: 'D:\\RailGaadi\\backend',
      script: 'dist/index.js',
      interpreter: 'D:\\Program Files\\nodejs\\node.exe',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      restart_delay: 3000,
      max_restarts: 20,
      min_uptime: '5s',
      env: {
        NODE_ENV: 'production',
        PORT: '3001',
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },

    // ─── Frontend: Vite Dev Server via Node launcher ──────────────────────────
    {
      name: 'railgaadi-frontend',
      cwd: 'D:\\RailGaadi',
      script: 'start-frontend.cjs',
      interpreter: 'D:\\Program Files\\nodejs\\node.exe',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '600M',
      restart_delay: 3000,
      max_restarts: 20,
      min_uptime: '5s',
      env: {
        NODE_ENV: 'development',
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
