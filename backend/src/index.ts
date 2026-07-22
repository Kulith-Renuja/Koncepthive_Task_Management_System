import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
    res.send('Task Management API is running');
});

// Start Server
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        // Test the database connection on startup
        await pool.query('SELECT 1');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
});