import { FastifyPluginAsync, FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { logger } from '../logger';
import { env } from '../config/env';

const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    logger.error(error, `Error during request to ${request.url}`);

    const reqId = request.headers['x-request-id'] as string || 'unknown';

    // Handle Validation Errors
    if (error.validation) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
          requestId: reqId
        }
      });
    }

    // Handle Rate Limit Errors
    if (error.statusCode === 429) {
      return reply.status(429).send({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests, please try again later.',
          requestId: reqId
        }
      });
    }

    // Handle Not Found Errors
    if (error.statusCode === 404) {
      return reply.status(404).send({
        error: {
          code: 'NOT_FOUND',
          message: error.message || 'Resource not found',
          requestId: reqId
        }
      });
    }

    const statusCode = error.statusCode || 500;
    
    // In production, do not leak raw error messages
    const message = env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal Server Error'
      : error.message;

    reply.status(statusCode).send({
      error: {
        code: error.code || 'INTERNAL_ERROR',
        message,
        requestId: reqId
      }
    });
  });
};

export default errorHandlerPlugin;
