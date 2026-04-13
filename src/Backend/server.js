import express from 'express';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CRUD ENDPOINTS FOR USERS

// CREATE - Add a new user
app.post('/api/users', (req, res) => {
    const { email, password_hash, display_name } = req.body;

    if (!email || !password_hash) {
        return res.status(400).json({ error: 'Email and password_hash are required' });
    }

    db.run(
        'INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)',
        [email, password_hash, display_name],
        function(err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(201).json({
                id: this.lastID,
                email,
                password_hash,
                display_name,
                created_at: new Date().toISOString()
            });
        }
    );
});

// READ - Get all users
app.get('/api/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});

// READ - Get a single user by ID
app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(row);
    });
});

// UPDATE - Update a user by ID
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { email, password_hash, display_name } = req.body;

    db.run(
        'UPDATE users SET email = ?, password_hash = ?, display_name = ? WHERE id = ?',
        [email, password_hash, display_name, id],
        function(err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ message: 'User updated successfully', id });
        }
    );
});

// DELETE - Delete a user by ID
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully', id });
    });
});

// MAJORS ENDPOINTS
app.get('/api/majors', (req, res) => {
    db.all('SELECT * FROM majors', [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/api/majors/:id', (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM majors WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Major not found' });
        }
        res.json(row);
    });
});

app.post('/api/majors', (req, res) => {
    const { id, collegeOfMajor, Department, major } = req.body;

    if (!id || !collegeOfMajor || !Department || !major) {
        return res.status(400).json({ error: 'id, collegeOfMajor, Department, and major are required' });
    }

    db.run(
        'INSERT INTO majors (id, collegeOfMajor, Department, major) VALUES (?, ?, ?, ?)',
        [id, collegeOfMajor, Department, major],
        function(err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(201).json({ id, collegeOfMajor, Department, major });
        }
    );
});

app.put('/api/majors/:id', (req, res) => {
    const { id } = req.params;
    const { collegeOfMajor, Department, major } = req.body;

    db.run(
        'UPDATE majors SET collegeOfMajor = ?, Department = ?, major = ? WHERE id = ?',
        [collegeOfMajor, Department, major, id],
        function(err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Major not found' });
            }
            res.json({ message: 'Major updated successfully', id });
        }
    );
});

app.delete('/api/majors/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM majors WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Major not found' });
        }
        res.json({ message: 'Major deleted successfully', id });
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});