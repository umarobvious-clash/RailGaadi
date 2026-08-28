import type { FastifyPluginAsync } from 'fastify';
import { createShareLink, getSharedJourney } from '../services/sharing.service';

const sharesRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post('/shares', {
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } }
  }, async (request, reply) => {
    const { trainId } = request.body as { trainId: string };
    if (!trainId) {
      reply.status(400);
      return { error: { code: 'INVALID_REQUEST', message: 'trainId is required', requestId: request.id } };
    }
    const result = await createShareLink(trainId);
    return { data: result };
  });

  fastify.get('/shares/:shareId', {
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } }
  }, async (request, reply) => {
    const { shareId } = request.params as { shareId: string };
    const result = await getSharedJourney(shareId);
    if (!result) {
      reply.status(404);
      return { error: { code: 'NOT_FOUND', message: 'Shared journey not found or expired', requestId: request.id } };
    }
    return { data: result };
  });
};

export default sharesRoute;
