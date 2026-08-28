import type { FastifyPluginAsync } from 'fastify';
import { getNearbyFeatures } from '../services/geo.service';

const geoRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/geo/features', {
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } }
  }, async (request, reply) => {
    const { trainId } = request.query as { trainId?: string };
    const features = await getNearbyFeatures(trainId || '12345');
    reply.header('Cache-Control', 'public, max-age=3600');
    return { data: features };
  });
};

export default geoRoute;
