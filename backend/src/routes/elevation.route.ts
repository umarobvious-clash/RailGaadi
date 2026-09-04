import type { FastifyPluginAsync } from 'fastify';
import { getRouteElevation } from '../services/terrain.service';

const elevationRoute: FastifyPluginAsync = async (fastify) => {
  const handler = async (request: any, reply: any) => {
    const { routeId, trainId } = request.params as { routeId?: string; trainId?: string };
    const id = routeId || trainId || '12301';
    const elevation = await getRouteElevation(id);
    reply.header('Cache-Control', 'public, max-age=86400');
    return { data: elevation };
  };

  fastify.get('/routes/:routeId/elevation', {
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } }
  }, handler);

  fastify.get('/trains/:trainId/elevation', {
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } }
  }, handler);
};

export default elevationRoute;
