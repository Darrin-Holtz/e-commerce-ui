import express, { Request, Response} from 'express';
import cors from 'cors';
import { clerkMiddleware, getAuth } from '@clerk/express';
import { shouldBeUser } from './middleware/authMiddleware.js';
import productRouter from './routes/product.route.js';
import categoryRouter from './routes/category.route.js';
import { consumer, producer } from './utils/kafka.js';

const app = express();
app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true
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

app.use((err: any, req: Request, res: Response, next: Function) => {
    console.error(err);
    return res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const start = async () => {
  app.listen(8000, () => {
    console.log("Product service is running on 8000");
  });

  Promise.all([producer.connect(), consumer.connect()]).catch((error) => {
    console.log("Kafka connection failed:", error?.message ?? error);
  });
};

start()
