import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const requestIdPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', (request, reply, done) => {
    const reqId = request.headers['x-request-id'] || crypto.randomUUID();
    request.headers['x-request-id'] = reqId;
    reply.header('x-request-id', reqId);
    done();
  });
};

export default fp(requestIdPlugin);
