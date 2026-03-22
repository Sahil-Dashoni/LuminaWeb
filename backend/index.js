import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDb from './config/db.js';
import authRouter from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import websiteRouter from './routes/websiteRoutes.js';
import billingRouter from './routes/billingRoutes.js';
import { stripeWebhook } from './controllers/stripeWebhookControllers.js';

const app= express();
app.post('/api/stripe/webhook', express.raw({type: 'application/json'}), stripeWebhook);
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'https://luminaweb-frontend.onrender.com',
    credentials: true
}))
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/website", websiteRouter);
app.use("/api/billing", billingRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDb();
    if(connectDb){
        console.log("Connected to MongoDB");
    }
});
