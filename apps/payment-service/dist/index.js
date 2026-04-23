import { serve } from '@hono/node-server';
import { Hono } from 'hono';
const app = new Hono();
app.get('/', (c) => {
    return c.text('Hello Hono!');
});
const start = async () => {
    try {
        serve({
            fetch: app.fetch,
            port: 8002,
        });
        console.log('Server is running on http://localhost:8002');
    }
    catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};
start();
