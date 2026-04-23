import Fastify from 'fastify';

const fastify = Fastify({
  logger: true,
});

fastify.get('/', async (request, reply) => {
  return reply.send('Order endpoint works!');
});

fastify.get('/health', async () => {
  return {
    service: 'order-service',
    status: 'ok',
    port: 8001,
  };
});

fastify.get('/test', async () => {
  return {
    service: 'order-service',
    message: 'Order test endpoint works!',
    timestamp: new Date().toISOString(),
  };
});

const start = async () => {
  try {
    await fastify.listen({ port: 8001 });
    console.log('Order service is running on port 8001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();