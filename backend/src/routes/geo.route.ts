import type { FastifyPluginAsync } from 'fastify';
import { getNearbyFeatures } from '../services/geo.service';

const geoRoute: FastifyPluginAsync = async (fastify) => {
  const handler = async (request: any, reply: any) => {
    const trainId = (request.query as any)?.trainId || (request.params as any)?.trainId || '12301';
    const features = await getNearbyFeatures(trainId);
    reply.header('Cache-Control', 'public, max-age=3600');
    return { data: features };
  };

  fastify.get('/geo/features', {
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } }
  }, handler);

  fastify.get('/trains/:trainId/features', {
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } }
  }, handler);
};

export default geoRoute;
