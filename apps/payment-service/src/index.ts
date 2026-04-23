import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

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

app.get('/test', (c) => {
  return c.json({
    service: 'payment-service',
    message: 'Payment test endpoint works!',
    timestamp: new Date().toISOString(),
  })
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
