import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Connect to MongoDB
await connectDB();

const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app);


// Root route for Vercel/Health checks
app.get('/', (req, res) => {
    res.send('Caz Fruits API is running');
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', env: process.env.NODE_ENV });
});


// ─── Socket.io Setup ──────────────────────────────────────────────
const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Admin clients join the admin-room
    socket.on('join-admin', () => {
        socket.join('admin-room');
        console.log(`🛡️  Admin joined admin-room: ${socket.id}`);
    });

    socket.on('disconnect', () => {
        console.log(`❌ Socket disconnected: ${socket.id}`);
    });
});

// Attach io to app so controllers can access it
app.set('io', io);

// ─── Middleware ────────────────────────────────────────────────────
const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5173',
];

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// ─── Routes ───────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check (redundant but kept for safety if needed at specific path)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', env: process.env.NODE_ENV });
});

// ─── Error Handling ───────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`);
    });
}

export default app;

