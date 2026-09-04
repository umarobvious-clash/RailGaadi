import type { FastifyPluginAsync } from 'fastify';
import { getTrainRoute } from '../../services/train.service';

const routeRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/:trainId/route', {
    // Add specific schema if needed
  }, async (request, reply) => {
    const { trainId } = request.params as { trainId: string };
    
    const routeData = await getTrainRoute(trainId);
    
    reply.header('Cache-Control', 'private, max-age=30, must-revalidate');
    return { data: routeData };
  });
};

export default routeRoute;
