import sqlite3 from 'sqlite3';

// Connect to profiles database
const profilesDb = new sqlite3.Database('./profiles.db', (err) => {
    if (err) {
        console.error('Failed to connect to profiles.db:', err.message);
    } else {
        console.log('Connected to profiles.db');
    }
});

// Create the profiles table if it doesn't already exist
profilesDb.run(`
    CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        visibility TEXT DEFAULT 'private',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER, -- Associate profiles with users
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
`);

// Connect to users database
const usersDb = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Failed to connect to users.db:', err.message);
    } else {
        console.log('Connected to users.db');
    }
});

// Create the users table if it doesn't already exist
usersDb.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL, -- Store hashed passwords
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
`);

export { profilesDb, usersDb };
