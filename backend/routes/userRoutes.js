import express from 'express';
import bcrypt from 'bcrypt';
import { usersDb } from '../database.js';

const router = express.Router();

// ✅ User Registration Route
router.post('/', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if the user already exists
        usersDb.get(`SELECT id FROM users WHERE email = ? OR username = ?`, [email, username], (err, row) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (row) {
                return res.status(400).json({ error: 'Email or username already exists' });
            }

            // Hash the password before storing
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Error hashing password:', err.message);
                    return res.status(500).json({ error: 'Error hashing password' });
                }

                // Insert user into the database
                usersDb.run(
                    `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
                    [username, email, hashedPassword],
                    function (err) {
                        if (err) {
                            console.error('Error inserting user:', err.message);
                            return res.status(500).json({ error: 'Error inserting user' });
                        }
                        res.status(201).json({
                            message: 'User registered successfully',
                            userId: this.lastID,
                        });
                    }
                );
            });
        });
    } catch (error) {
        console.error('Unexpected server error:', error.message);
        res.status(500).json({ error: 'Unexpected server error' });
    }
});

// User login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    usersDb.get(`SELECT id, password FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err.message);
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Save user ID in session
            req.session.userId = user.id;
            res.json({ message: 'Login successful', userId: user.id });
        });
    });
});

// Check session status
router.get('/session', (req, res) => {
    if (req.session.userId) {
        usersDb.get(
            `SELECT id, username FROM users WHERE id = ?`,
            [req.session.userId],
            (err, user) => {
                if (err) {
                    console.error('Database error:', err.message);
                    return res.status(500).json({
                        loggedIn: false,
                        error: 'Internal server error',
                    });
                }
                if (!user) {
                    return res.status(404).json({
                        loggedIn: false,
                        error: 'User not found',
                    });
                }
                res.json({
                    loggedIn: true,
                    user: { id: user.id, username: user.username },
                });
            }
        );
    } else {
        res.json({ loggedIn: false });
    }
});

// User logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err.message);
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
    });
});

export default router;