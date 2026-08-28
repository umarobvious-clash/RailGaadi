import type { FastifyPluginAsync } from 'fastify';
import { getLiveJourneyByNumber } from '../../services/train.service';

const liveRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/:trainId/live', {
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } }
  }, async (request, reply) => {
    const { trainId } = request.params as { trainId: string };
    
    const journey = await getLiveJourneyByNumber(trainId);
    
    reply.header('Cache-Control', 'public, max-age=30');
    return { data: journey };
  });
};

export default liveRoute;
