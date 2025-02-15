import fs from 'fs';
import sqlite3 from 'sqlite3';
import { promisify } from 'util';

// Promisify for easier async/await
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);

// Paths to database files
const usersDbPath = './users.db';
const profilesDbPath = './profiles.db';

// Paths to .env files
const backendEnvPath = './.env';
const frontendEnvPath = '../frontend/.env';

// Default .env content
const backendEnvContent = `
SESSION_SECRET=your-secret-key
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
PORT=3000
API_BASE_URL=http://localhost:3000
`;

const frontendEnvContent = `
PORT=3001
REACT_APP_BACKEND_URL=http://localhost:3000
`;

// Function to create a SQLite database if it doesn't exist
async function createDatabase(dbPath, schema) {
    if (!(await exists(dbPath))) {
        console.log(`Creating database: ${dbPath}`);
        const db = new sqlite3.Database(dbPath);
        db.serialize(() => {
            schema.forEach((query) => db.run(query));
        });
        db.close();
        console.log(`${dbPath} created successfully.`);
    } else {
        console.log(`${dbPath} already exists. Skipping creation.`);
    }
}

// User database schema
const usersDbSchema = [
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
];

// Profiles database schema
const profilesDbSchema = [
    `CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        visibility TEXT DEFAULT 'private',
        data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    );`,
];

// Function to create .env files if they don't exist
async function createEnvFile(filePath, content) {
    if (!(await exists(filePath))) {
        console.log(`Creating .env file at: ${filePath}`);
        await writeFile(filePath, content.trim());
        console.log(`.env file created at: ${filePath}`);
    } else {
        console.log(`.env file already exists at: ${filePath}. Skipping creation.`);
    }
}

// Main installer logic
async function main() {
    console.log('Starting installation...');

    // Create databases
    await createDatabase(usersDbPath, usersDbSchema);
    await createDatabase(profilesDbPath, profilesDbSchema);

    // Create .env files
    await createEnvFile(backendEnvPath, backendEnvContent);
    await createEnvFile(frontendEnvPath, frontendEnvContent);

    console.log('Installation complete.');
}

main().catch((err) => {
    console.error('Error during installation:', err);
});
