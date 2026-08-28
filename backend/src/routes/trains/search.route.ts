import type { FastifyPluginAsync } from 'fastify';
import { searchTrains } from '../../services/train.service';

const searchRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/search', {
    schema: {
      querystring: {
        type: 'object',
        required: ['q'],
        properties: {
          q: { type: 'string', minLength: 2, maxLength: 100 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: { type: 'array' },
            meta: { type: 'object' }
          }
        }
      }
    },
    config: { rateLimit: { max: 30, timeWindow: '1 minute' } }
  }, async (request, reply) => {
    const { q } = request.query as { q: string };
    const results = await searchTrains(q);
    return { data: results, meta: { query: q } };
  });
};

export default searchRoute;
