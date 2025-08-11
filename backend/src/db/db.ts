import Database from "better-sqlite3";
import fs from 'fs';
import path from 'path';

// Define the path to the database file
const setupSQL = fs.readFileSync(path.join(__dirname, 'setup.sql'), 'utf-8');

// Create and open the SQLite database with an absolute path
const dbPath = path.join(__dirname, '../../database.db');
const db = new Database(dbPath);

// Apply setup only if tables don't exist
const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();

if (!tableExists) {
  // Apply setup script for a fresh database
  db.exec(setupSQL);
  console.log('Database initialized with tables');
}

export default db;
