import type { FastifyPluginAsync } from 'fastify';
import { getJourneyWeather } from '../services/weather.service';

const weatherRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/journeys/:trainId/weather', {
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } }
  }, async (request, reply) => {
    const { trainId } = request.params as { trainId: string };
    const weather = await getJourneyWeather(trainId);
    reply.header('Cache-Control', 'public, max-age=600');
    return { data: weather };
  });
};

export default weatherRoute;
