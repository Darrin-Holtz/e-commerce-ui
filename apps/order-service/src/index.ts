import Fastify from 'fastify';
import { clerkPlugin, getAuth } from '@clerk/fastify';

const fastify = Fastify();

fastify.get('/', async (request, reply) => {
  return reply.send('Order endpoint works!');
});

fastify.register(clerkPlugin)

fastify.get('/health', async () => {
  return {
    service: 'order-service',
    status: 'ok',
    port: 8001,
  };
});

fastify.get('/test', async (request, reply) => {
  const { userId } = getAuth(request);
  if(!userId) {
   return reply.send({ error: 'Unauthorized' });
  }
   return reply.send({ message: `Hello, user ${userId}!` });
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