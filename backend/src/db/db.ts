import Database from "better-sqlite3";
import fs from 'fs';
import path from 'path';

// Define the path to the database file
const setupSQL = fs.readFileSync(path.join(__dirname, 'setup.sql'), 'utf-8');

// Create and open the SQLite database
const db = new Database('database.db');

// Apply requested of setup
db.exec(setupSQL);

export default db;
