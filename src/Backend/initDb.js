import db from './db.js';

/**
 * this is the function to create the users table
 */
function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            display_name TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Error creating table:', err);
        else console.log('Users table ready');
        
        db.run(`
            INSERT OR IGNORE INTO users (email, password_hash, display_name)
            VALUES (?, ?, ?)
        `, ['user@example.com', 'hashedpassword123', 'John Doe'], (err) => {
            if (err) console.error('Error inserting data:', err);
            else console.log('Sample data inserted');
            db.close();
        });
    });
}

initializeDatabase();