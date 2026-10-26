import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import { env } from '../config/env';

const corsPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(cors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) {
        cb(null, true);
        return;
      }

      // Allow all localhost / 127.0.0.1 ports (5173, 5174, 5175, etc.)
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      // Allow popular cloud deployment domains (Render, Vercel, Railway)
      const isCloudDeploy = /^https?:\/\/[a-z0-9-]+\.(onrender\.com|vercel\.app|up\.railway\.app)(:\d+)?$/i.test(origin);

      const allowedUrls = (env.FRONTEND_URL || '')
        .split(',')
        .map((u) => u.trim())
        .filter(Boolean);

      if (isLocalhost || isCloudDeploy || allowedUrls.includes(origin)) {
        cb(null, true);
        return;
      }

      cb(new Error(`Not allowed by CORS: ${origin}`), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'X-Request-Id'],
    exposedHeaders: ['X-Request-Id'],
    credentials: true,
  });
};

export default fp(corsPlugin);
