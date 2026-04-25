import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { shouldBeUser } from './middleware/authMiddleware.js'

const app = new Hono()
app.use('*', clerkMiddleware())

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

app.get('/test',shouldBeUser, (c) => {
  
  return c.json({ message: 'Payment endpoint works and you are authenticated!', userId: c.get("userId") })
})

const start = async () => {
  try{
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
