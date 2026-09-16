import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(__dirname, '../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'kommand.db');

const db = new sqlite3.Database(dbPath, (err: Error | null) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
    initSchema();
  }
});

function initSchema() {
  db.serialize(() => {
    // Users table for lightweight local authentication instead of hardcoded .env admin passwords
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err: Error | null) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('Users table ready.');
        // Seed a default admin user if none exists
        db.get(`SELECT COUNT(*) as count FROM users`, (err: Error | null, row: any) => {
          if (!err && row && row.count === 0) {
            const defaultUser = process.env.ADMIN_USERNAME || 'admin';
            const defaultPass = process.env.ADMIN_PASSWORD || 'admin123';
            db.run(
              `INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
              [defaultUser, defaultPass, 'admin'],
              (insertErr: Error | null) => {
                if (insertErr) {
                  console.error('Failed to seed default admin user:', insertErr.message);
                } else {
                  console.log(`Seeded default admin user (${defaultUser}) into SQLite database.`);
                }
              }
            );
          }
        });
      }
    });

    // Settings / configuration table
    db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `, (err: Error | null) => {
      if (!err) {
        console.log('Settings table ready.');
      }
    });
  });
}

export default db;
