import type { FastifyPluginAsync } from 'fastify';
import { getRouteElevation } from '../services/terrain.service';

const elevationRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/routes/:routeId/elevation', {
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } }
  }, async (request, reply) => {
    const { routeId } = request.params as { routeId: string };
    const elevation = await getRouteElevation(routeId);
    reply.header('Cache-Control', 'public, max-age=86400');
    return { data: elevation };
  });
};

export default elevationRoute;
