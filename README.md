# CollegeMajorFinder

A full-stack web application for Murray State University students to explore, filter, and find the college major that best fits their interests. Built with React + Vite on the frontend and Express + SQLite on the backend.

## Features

- **Authentication** — Register and sign in with a `@murraystate.edu` email address; forgot-password reset flow included.
- **Client-Side Validation** — Email domain validation, password strength checks, and confirm-password validation are enforced in all auth forms before API submission.
- **Route-Based Navigation** — Browser URL routes are fully wired with protected route behavior (`/login`, `/register`, `/forgot-password`, `/dashboard`, `/quiz`).
- **Major Explorer** — Browse all MSU majors in a searchable, filterable grid. Filter by college, department, or interest area tag (STEM, Business, Health, Education, Arts & Media, Law & Policy, Agriculture, Humanities).
- **Learn More Panels** — Expand any major card to see top high-paying career paths with median salaries, key skills you'll develop, and a direct link to the Murray State curriculum page.
- **Personalized Quiz** — Rate 8 interest statements on a 1–5 scale and receive a ranked list of the 12 best-matching majors with compatibility scores.
- **"Why This Matched You"** — Expandable breakdown on each quiz result showing which of your interest ratings drove the match, with a per-trait score bar and strength label.
- **Save Quiz Profile** — Quiz answers and results are persisted to the database and restored automatically on next sign-in.
- **Saved Majors (Favorites)** — Heart button on every major card saves it to your personal list. The "Saved Majors" stat card filters the grid to show only your saved majors.
- **Major Comparison** — Add up to 3 majors to a side-by-side comparison panel (sticky at the bottom) showing college, department, interest area, top careers, and key skills.
- **Shared API Layer** — Frontend API requests are centralized through an Axios service module for consistent error handling and cleaner component code.

## Project Structure

```
CollegeMajorFinder/
├── src/
│   ├── App.jsx              # Root router (login / register / dashboard / quiz)
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   ├── services/
│   │   └── api.js           # Shared Axios API client and endpoint helpers
│   ├── utils/
│   │   └── validation.js    # Shared client-side validation helpers
│   ├── Backend/
│   │   ├── db.js            # SQLite connection
│   │   ├── initDb.js        # Initialize users table
│   │   ├── initMajorDb.js   # Import majors from CSV
│   │   ├── server.js        # Express API server (port 3000)
│   │   └── db/
│   │       └── app.db       # SQLite database
│   └── Frontend/
│       ├── LoginPage.jsx
│       ├── RegisterPage.jsx
│       ├── ForgotPassword.jsx
│       ├── Dashboard.jsx    # Major explorer with filters, favorites, comparison
│       ├── Dashboard.css
│       ├── QuizPage.jsx     # Interest quiz + ranked results
│       ├── QuizPage.css
│       ├── quizConfig.js    # Quiz questions, scoring logic
│       └── Auth.css
├── Majors.csv               # Source data for majors
├── Schema.md                # Database schema documentation
├── package.json
└── vite.config.js
```

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/idaugherty/CollegeMajorFinder.git
   cd CollegeMajorFinder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   node src/Backend/initDb.js
   node src/Backend/initMajorDb.js
   ```

### Running the Application

> **Note:** This project uses a single-repo structure established in a prior assignment. The backend and frontend are both run from the project root.

1. Start the backend server (equivalent to `cd /backend && npm run dev`):
   ```bash
   npm run server
   ```
   The API runs on `http://localhost:3000`.

2. In a separate terminal, start the frontend (equivalent to `cd /frontend && npm run dev`):
   ```bash
   npm run dev
   ```
   The app is available at `http://localhost:5173`.

### Frontend Routes

- `/login` — Sign in page
- `/register` — Account creation page
- `/forgot-password` — Password reset flow
- `/dashboard` — Major explorer and comparison dashboard (protected)
- `/quiz` — Personalized major ranking quiz (protected)

### Environment Variable (Optional)

By default, the frontend uses `http://localhost:3000` for API requests.

To override the API base URL, create a `.env` file at the project root:

```bash
VITE_API_URL=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new `@murraystate.edu` account
- `POST /api/auth/login` — Sign in and receive user data
- `POST /api/auth/reset-password` — Reset password by email

### Users
- `GET /api/users` — Get all users
- `GET /api/users/:id` — Get user by ID
- `POST /api/users` — Create a user
- `PUT /api/users/:id` — Update a user
- `DELETE /api/users/:id` — Delete a user

### Majors
- `GET /api/majors` — Get all majors
- `GET /api/majors/:id` — Get major by ID
- `POST /api/majors` — Create a major
- `PUT /api/majors/:id` — Update a major
- `DELETE /api/majors/:id` — Delete a major

### Quiz Profile
- `GET /api/quiz-profile/:userId` — Load saved quiz answers and results
- `POST /api/quiz-profile` — Save (upsert) quiz answers and results

### Favorites
- `GET /api/favorites/:userId` — Get all favorited major IDs for a user
- `POST /api/favorites` — Add a favorite `{ userId, majorId }`
- `DELETE /api/favorites/:userId/:majorId` — Remove a favorite

### Health Check
- `GET /api/health` — Confirm server is running

## Database Schema

See [Schema.md](Schema.md) for full table definitions. The database contains four tables:

| Table | Purpose |
|---|---|
| `users` | Registered accounts |
| `majors` | All MSU majors (loaded from CSV) |
| `quiz_profiles` | Saved quiz answers and ranked results per user |
| `user_favorites` | User's saved/favorited majors |

## Development

- **Lint**: `npm run lint`
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## Technologies Used

- **Frontend**: React 19, React Router DOM, Axios, Vite, ESLint
- **Backend**: Express.js, SQLite3 (sqlite3 npm package), bcryptjs
- **Data Import**: csv-parser
