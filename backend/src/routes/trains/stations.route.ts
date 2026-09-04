import type { FastifyPluginAsync } from 'fastify';
import { getTrainStations } from '../../services/train.service';

const stationsRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/:trainId/stations', {
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } }
  }, async (request, reply) => {
    const { trainId } = request.params as { trainId: string };
    const stations = await getTrainStations(trainId);
    reply.header('Cache-Control', 'private, max-age=30, must-revalidate');
    return { data: stations };
  });
};

export default stationsRoute;
