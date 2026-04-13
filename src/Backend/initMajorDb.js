import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csvParser from 'csv-parser';

//creating the database table
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'db', 'app.db'); // or users.db
const csvPath = path.join(__dirname, '..', '..', 'Majors.csv');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) throw err;
  console.log('Connected to SQLite:', dbPath);
});

//setting the rows for the database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS majors (
      id INTEGER PRIMARY KEY,
      collegeOfMajor TEXT,
      Department TEXT,
      major TEXT
    )
  `);

  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO majors (id, collegeOfMajor, Department, major)
    VALUES (?, ?, ?, ?)
  `);

  //reading the csv file for table
  fs.createReadStream(csvPath)
    .pipe(csvParser())
    .on('data', (row) => {
      insertStmt.run(
        row.id,
        row.collegeOfMajor,
        row.Department,
        row.major
      );
    })
    .on('end', () => {
      insertStmt.finalize();
      console.log('Majors data imported successfully.');
      db.close();
    })
    .on('error', (err) => {
      console.error('CSV read error:', err);
    });
});