# CollegeMajorFinder

A React application built with Vite for finding and managing college majors, featuring a backend API powered by Express and SQLite.

## Features

- **Frontend**: React app with Vite for fast development and HMR.
- **Backend**: Express server with SQLite database.
- **Database**: Stores user accounts and college majors data.
- **API**: RESTful endpoints for users and majors CRUD operations.

## Project Structure

```
CollegeMajorFinder/
├── src/
│   ├── Backend/
│   │   ├── db.js          # Database connection
│   │   ├── initDb.js      # Initialize users table
│   │   ├── initMajorDb.js # Import majors from CSV
│   │   ├── server.js      # Express API server
│   │   └── db/
│   │       └── app.db     # SQLite database
│   └── Frontend/
│       ├── App.jsx        # Main React app
│       └── ...            # Other React components
├── Majors.csv             # Source data for majors
├── Schema.md              # Database schema documentation
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
   git clone <repository-url>
   cd CollegeMajorFinder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Initialize users table:
     ```bash
     node src/Backend/initDb.js
     ```
   - Import majors data from CSV:
     ```bash
     node src/Backend/initMajorDb.js
     ```

### Running the Application

1. Start the backend server:
   ```bash
   node src/Backend/server.js
   ```
   The server will run on `http://localhost:3000`.

2. In a new terminal, start the frontend:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update user by ID
- `DELETE /api/users/:id` - Delete user by ID

### Majors
- `GET /api/majors` - Get all majors
- `GET /api/majors/:id` - Get major by ID
- `POST /api/majors` - Create a new major
- `PUT /api/majors/:id` - Update major by ID
- `DELETE /api/majors/:id` - Delete major by ID

### Health Check
- `GET /api/health` - Check server status

## Database Schema

See [Schema.md](Schema.md) for detailed database schema information.

## Development

- **Linting**: `npm run lint`
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## Technologies Used

- **Frontend**: React, Vite
- **Backend**: Express.js, SQLite3
- **Data Import**: csv-parser
- **Linting**: ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
