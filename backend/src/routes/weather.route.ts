import type { FastifyPluginAsync } from 'fastify';
import { getJourneyWeather } from '../services/weather.service';

const weatherRoute: FastifyPluginAsync = async (fastify) => {
  const handler = async (request: any, reply: any) => {
    const { trainId } = request.params as { trainId: string };
    const weather = await getJourneyWeather(trainId);
    reply.header('Cache-Control', 'public, max-age=600');
    return { data: weather };
  };

  fastify.get('/journeys/:trainId/weather', {
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } }
  }, handler);

  fastify.get('/trains/:trainId/weather', {
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } }
  }, handler);
};

export default weatherRoute;
