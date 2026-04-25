import express, { Request, Response} from 'express';
import cors from 'cors';
import { clerkMiddleware, getAuth } from '@clerk/express';
import { shouldBeUser } from './middleware/authMiddleware.js';
import productRouter from './routes/product.route.js';
import categoryRouter from './routes/category.route.js';

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], credentials: true
}))

app.use(express.json());
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

app.get('/test', shouldBeUser, (req: Request, res: Response) => {   
        res.json({ message: 'Product endpoint works and you are authenticated!', userId: req.userId });
});

app.use("/products", productRouter);
app.use("/categories", categoryRouter);


app.listen(8000, () => {
    console.log('Product service is running on port 8000');
});
