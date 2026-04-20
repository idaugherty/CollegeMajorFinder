import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@murraystate\.edu$/i;

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function isAllowedEmail(email) {
    return ALLOWED_EMAIL_REGEX.test(email);
}

// Middleware
app.use(cors());
app.use(express.json());

db.run(`
    CREATE TABLE IF NOT EXISTS quiz_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        answers_json TEXT NOT NULL,
        results_json TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`);

function parseUserId(value) {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

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

            db.run('DELETE FROM users WHERE id = ?', [id], function(_err) {
        if (_err) {
            return res.status(400).json({ error: _err.message });
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

    db.run('DELETE FROM majors WHERE id = ?', [id], function(_err) {
        if (_err) {
            return res.status(400).json({ error: _err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Major not found' });
        }
        res.json({ message: 'Major deleted successfully', id });
    });
});

// QUIZ PROFILE ENDPOINTS
app.get('/api/quiz-profile/:userId', (req, res) => {
    const userId = parseUserId(req.params.userId);
    if (!userId) {
        return res.status(400).json({ error: 'Invalid user id' });
    }

    db.get(
        'SELECT answers_json, results_json, updated_at FROM quiz_profiles WHERE user_id = ?',
        [userId],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Server error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Quiz profile not found' });
            }

            try {
                return res.json({
                    answers: JSON.parse(row.answers_json),
                    results: JSON.parse(row.results_json),
                    updated_at: row.updated_at
                });
            } catch {
                return res.status(500).json({ error: 'Saved quiz profile is invalid' });
            }
        }
    );
});

app.post('/api/quiz-profile', (req, res) => {
    const userId = parseUserId(req.body.userId);
    const { answers, results } = req.body;

    if (!userId || !answers || !results) {
        return res.status(400).json({ error: 'userId, answers, and results are required' });
    }

    const answersJson = JSON.stringify(answers);
    const resultsJson = JSON.stringify(results);

    db.run(
        `
            INSERT INTO quiz_profiles (user_id, answers_json, results_json, updated_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id)
            DO UPDATE SET
                answers_json = excluded.answers_json,
                results_json = excluded.results_json,
                updated_at = CURRENT_TIMESTAMP
        `,
        [userId, answersJson, resultsJson],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Could not save quiz profile' });
            }

            return res.json({ message: 'Quiz profile saved successfully' });
        }
    );
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// AUTH ENDPOINTS

// Register new user
app.post('/api/auth/register', async (req, res) => {
    const { password, display_name } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    if (!isAllowedEmail(email)) {
        return res.status(400).json({ error: 'Email must end with @murraystate.edu' });
    }

    try {
        const password_hash = await bcrypt.hash(password, 10);
        db.run(
            'INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)',
            [email, password_hash, display_name || null],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(409).json({ error: 'An account with that email already exists' });
                    }
                    return res.status(400).json({ error: err.message });
                }
                res.status(201).json({ id: this.lastID, email, display_name: display_name || null });
            }
        );
    } catch (_err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    if (!isAllowedEmail(email)) {
        return res.status(400).json({ error: 'Email must end with @murraystate.edu' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        if (!user) return res.status(401).json({ error: 'Invalid email or password' });

        try {
            const match = await bcrypt.compare(password, user.password_hash);
            if (!match) return res.status(401).json({ error: 'Invalid email or password' });
            res.json({ id: user.id, email: user.email, display_name: user.display_name });
        } catch (_err) {
            res.status(500).json({ error: 'Server error' });
        }
    });
});

// Reset (forgot) password — verify email exists, then update password
app.post('/api/auth/reset-password', (req, res) => {
    const { newPassword, checkOnly } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    if (!isAllowedEmail(email)) {
        return res.status(400).json({ error: 'Email must end with @murraystate.edu' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        if (!user) return res.status(404).json({ error: 'No account found with that email' });

        // Just checking the email exists
        if (checkOnly) {
            return res.json({ exists: true });
        }

        if (!newPassword) {
            return res.status(400).json({ error: 'New password is required' });
        }

        try {
            const password_hash = await bcrypt.hash(newPassword, 10);
            db.run(
                'UPDATE users SET password_hash = ? WHERE email = ?',
                [password_hash, email],
                function(err) {
                    if (err) return res.status(500).json({ error: 'Server error' });
                    res.json({ message: 'Password updated successfully' });
                }
            );
        } catch (_err) {
            res.status(500).json({ error: 'Server error' });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});