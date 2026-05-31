import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { clerkMiddleware } from '@clerk/hono'
import { shouldBeUser } from './middleware/authMiddleware.js'
import sessionRoute from './routes/session.route.js'
import productRoute from './routes/product.route.js'
import webhooksRoute from './routes/webhooks.route.js'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { consumer, producer } from './utils/kafka.js'
import { runKafkaSubscriptions } from './utils/subscriptions.js'

const app = new Hono()

app.use('*', logger())

// Webhooks must be registered before body-parsing middleware
app.route("/webhooks", webhooksRoute)

app.use('*', clerkMiddleware())
app.use('*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PUT', 'DELETE'] }))

app.get('/', (c) => {
  return c.text('Payment endpoint works!');
})

app.get('/health', (c) => {
  return c.json({
    service: 'payment-service',
    status: 'ok',
    port: 8002,
  })
})

app.route("/sessions", sessionRoute)
app.route("/products", productRoute)

app.get('/test',shouldBeUser, (c) => {
  
  return c.json({ message: 'Payment endpoint works and you are authenticated!', userId: c.get("userId") })
})

const start = async () => {
  const port = parseInt(process.env.PORT || "8002", 10);
  serve({
    fetch: app.fetch,
    port,
    hostname: "0.0.0.0",
  });
  console.log(`Payment service is running on port ${port}`);

  // Connect Kafka after HTTP server is up so port binding never blocks
  Promise.all([producer.connect(), consumer.connect()])
    .then(() => runKafkaSubscriptions())
    .catch((error) => console.error("Kafka connection failed:", error));
};

start();
