import Fastify from 'fastify';
import path from 'path';
import fs from 'fs';
import { env } from './config/env';
import { logger } from './logger';

// Plugins
import requestIdPlugin from './plugins/requestId';
import corsPlugin from './plugins/cors';
import securityPlugin from './plugins/security';
import rateLimitPlugin from './plugins/rateLimit';
import errorHandlerPlugin from './plugins/errorHandler';

// Routes
import healthRoute from './routes/health.route';
import searchRoute from './routes/trains/search.route';
import liveRoute from './routes/trains/live.route';
import routeRoute from './routes/trains/route.route';
import stationsRoute from './routes/trains/stations.route';
import weatherRoute from './routes/weather.route';
import elevationRoute from './routes/elevation.route';
import geoRoute from './routes/geo.route';
import sharesRoute from './routes/shares.route';

const buildServer = async () => {
  const fastify = Fastify({
    logger: false,
    disableRequestLogging: true,
  });

  // Plugins Registration - Order matters
  await fastify.register(requestIdPlugin);
  await fastify.register(corsPlugin);
  await fastify.register(securityPlugin);
  await fastify.register(rateLimitPlugin);
  await fastify.register(errorHandlerPlugin);

  // Request Logging
  fastify.addHook('onRequest', (request, reply, done) => {
    logger.info({ reqId: request.headers['x-request-id'], method: request.method, url: request.url }, 'incoming request');
    done();
  });

  fastify.addHook('onResponse', (request, reply, done) => {
    logger.info({ reqId: request.headers['x-request-id'], statusCode: reply.statusCode, responseTime: reply.elapsedTime }, 'request completed');
    done();
  });

  // API Routes Registration
  const registerApiRoutes = async (api: any) => {
    await api.register(healthRoute);
    await api.register(async (trainsRouter: any) => {
      await trainsRouter.register(searchRoute);
      await trainsRouter.register(liveRoute);
      await trainsRouter.register(routeRoute);
      await trainsRouter.register(stationsRoute);
    }, { prefix: '/trains' });
    await api.register(weatherRoute);
    await api.register(elevationRoute);
    await api.register(geoRoute);
    await api.register(sharesRoute);
  };

  await fastify.register(registerApiRoutes, { prefix: '/api/v1' });
  await fastify.register(registerApiRoutes, { prefix: '/api' });
  await fastify.register(registerApiRoutes);

  // Serve frontend SPA from Fastify directly so app works as a single standalone server
  const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
  if (fs.existsSync(frontendDist)) {
    const contentTypes: Record<string, string> = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff2': 'font/woff2',
    };

    fastify.addHook('onRequest', async (request, reply) => {
      if (request.url.startsWith('/api')) return;
      const cleanPath = request.url.split('?')[0];
      const filePath = path.join(frontendDist, cleanPath === '/' ? 'index.html' : cleanPath);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        reply.type(contentTypes[ext] || 'application/octet-stream');
        return reply.send(fs.createReadStream(filePath));
      }
    });

    fastify.setNotFoundHandler((request, reply) => {
      if (request.url.startsWith('/api')) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: `Route ${request.method}:${request.url} not found`,
        });
      }
      reply.type('text/html; charset=utf-8');
      return reply.send(fs.createReadStream(path.join(frontendDist, 'index.html')));
    });
  }

  return fastify;
};

const start = async () => {
  try {
    const app = await buildServer();
    
    const listeners = ['SIGINT', 'SIGTERM'];
    listeners.forEach((signal) => {
      process.on(signal, async () => {
        logger.info('Received ' + signal + ', shutting down gracefully...');
        await app.close();
        process.exit(0);
      });
    });

    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    logger.info('Server listening on port ' + env.PORT + ' in ' + env.NODE_ENV + ' mode');
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
