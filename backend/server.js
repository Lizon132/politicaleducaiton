import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import userRoutes from './routes/userRoutes.js'; // Modular user routes
import { profilesDb, usersDb } from './database.js';
import https from 'https';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Constants
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const SESSION_SECRET = process.env.SESSION_SECRET || 'defaultSecret';

// Initialize the app
const app = express();
app.use(bodyParser.json());

// Enable CORS
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3001', // Allow frontend requests
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
        credentials: true, // Allow cookies in requests
    })
);

// Use helmet for setting security headers
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                defaultSrc: ["'self'"],
                imgSrc: ["'self'", "data:", BASE_URL],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                connectSrc: ["'self'", BASE_URL],
            },
        },
    })
);

// HTTPS Configuration
if (process.env.NODE_ENV !== 'production') {
    const httpsServer = https.createServer(
        {
            key: fs.readFileSync('server.key'), // Path to your private key
            cert: fs.readFileSync('server.cert'), // Path to your certificate
        },
        app
    );

    httpsServer.listen(PORT, () => {
        console.log(`Server running at https://localhost:${PORT}`);
    });
} else {
    // Fallback to HTTP if not running HTTPS (use only in production setup)
    app.listen(PORT, () => {
        console.log(`Server running at ${BASE_URL}`);
    });
}
// Configure session
const SQLiteSessionStore = SQLiteStore(session);
app.use(
    session({
        store: new SQLiteSessionStore({ db: 'sessions.db', dir: './' }),
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
            sameSite: 'strict', // Protect against CSRF
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
    })
);

// Middleware to protect routes
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// Routes
app.use('/user', userRoutes); // Use modular user routes

// Fetch user profile
app.get('/user/profile', requireAuth, (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    usersDb.get(
        `SELECT id, username, email, created_at FROM users WHERE id = ?`,
        [userId],
        (err, user) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ profile: user });
        }
    );
});

// Example protected route
app.get('/dashboard', requireAuth, (req, res) => {
    res.json({ message: 'Welcome to the dashboard!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start the server
app.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
        console.error(`Failed to start server: ${err.message}`);
        process.exit(1);
    } else {
        console.log(`Server running at http://localhost:${PORT}`);
    }
});
