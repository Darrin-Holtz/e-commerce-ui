import express, { Request, Response} from 'express';
import cors from 'cors';
import { clerkMiddleware, getAuth } from '@clerk/express';

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], credentials: true
}))

app.use(clerkMiddleware()) // Add Clerk middleware to handle authentication and user sessions

app.get('/', (req: Request, res: Response) => {
    res.json('Product endpoint works!');
});

app.get('/health', (req: Request, res: Response) => {
    res.json({
        service: 'product-service',
        status: 'ok',
        port: 8000,
    });
});

app.get('/test', (req, res) => {
    const auth = getAuth(req);
    const userId = auth.userId;

    if (!userId) {
        return res.status(401).json({ error: 'You are not logged in' });
    }
    res.json({
        service: 'product-service',
        message: 'Product test endpoint works!',
        userId: userId,
        timestamp: new Date().toISOString(),
    });
});


app.listen(8000, () => {
    console.log('Product service is running on port 8000');
});
