import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import goalRoutes from "./routes/goalRoutes.js"
import historyRoutes from "./routes/historyRoutes.js"
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
dotenv.config();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// MongoDB connection  
connectDb();

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/income', incomeRoutes);
app.use('/api/v1/expense', expenseRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/goals', goalRoutes)
app.use('/api/v1/history', historyRoutes)

// Fixed static file serving with proper __dirname
app.use('/uploads', express.static(join(__dirname, "uploads")));

const PORT = process.env.PORT || 8000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});