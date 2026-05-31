import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { shouldBeAdmin } from "./middleware/authMiddleware.js";
import userRoute from "./routes/user.route.js";
import { producer } from "./utils/kafka.js";

const app = express();
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["http://localhost:3001"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware());

app.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use("/users", shouldBeAdmin, userRoute);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res
    .status(err.status || 500)
    .json({ message: err.message || "Inter Server Error!" });
});

const start = async () => {
  try {
    await producer.connect();
    const port = parseInt(process.env.PORT || "8003", 10);
    app.listen(port, "0.0.0.0", () => {
      console.log("Auth service is running on 8003");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();