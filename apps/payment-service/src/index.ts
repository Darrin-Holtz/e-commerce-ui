import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { clerkMiddleware } from '@hono/clerk-auth'
import { shouldBeUser } from './middleware/authMiddleware.js'
import sessionRoute from './routes/session.route.js'
import productRoute from './routes/product.route.js'
import webhooksRoute from './routes/webhooks.route.js'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { consumer, producer } from './utils/kafka.js'

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
  try{
    Promise.all([ await producer.connect(), await consumer.connect()])
    serve({
      fetch: app.fetch,
      port: 8002,
    })
    console.log('Payment service is running on http://localhost:8002')
  } catch (error) {
    console.error('Error starting server:', error)
    process.exit(1)
  }
}

start()
