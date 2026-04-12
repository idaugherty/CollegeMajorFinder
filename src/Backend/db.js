/***
 * this is going to host the connection configuring for my databases
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

//getting the directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url));
//making the database path
const dbPath = path.join(__dirname, 'db', 'users.db');

//making the database
const db = new sqlite3.Database(dbPath, (err)=> {
    if(err) {
        console.error('Database error:', err);
    } else {
        console.log('Connected to SQLite');
    }
});

export default db;