# CollegeMajorFinder Database Schema

# app.db

---

## Table: users

Stores registered user accounts. Only `@murraystate.edu` email addresses are accepted.

| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| email | TEXT | UNIQUE NOT NULL |
| password_hash | TEXT | NOT NULL |
| display_name | TEXT | |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

```json
{
  "id": "int",
  "email": "string",
  "password_hash": "string",
  "display_name": "string",
  "created_at": "datetime"
}
```

---

## Table: majors

Stores all available Murray State University majors, loaded from `Majors.csv` via `initMajorDb.js`.

| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY |
| collegeOfMajor | TEXT | NOT NULL |
| Department | TEXT | NOT NULL |
| major | TEXT | NOT NULL |

```json
{
  "id": "int",
  "collegeOfMajor": "string",
  "Department": "string",
  "major": "string"
}
```

---

## Table: quiz_profiles

Stores a user's most recent quiz answers and ranked results. One row per user (upserted on save).

| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| user_id | INTEGER | NOT NULL UNIQUE, FK → users(id) |
| answers_json | TEXT | NOT NULL |
| results_json | TEXT | NOT NULL |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

`answers_json` — JSON object mapping quiz question IDs to integer scores (1–5).

```json
{
  "business": 4,
  "technology": 5,
  "creative": 2,
  "people": 3,
  "science": 4,
  "outdoor": 1,
  "society": 3,
  "language": 2
}
```

`results_json` — JSON array of ranked major match objects (top 12), as returned by `getRankedQuizMatches()`.

```json
[
  {
    "id": "int",
    "major": "string",
    "Department": "string",
    "collegeOfMajor": "string",
    "compatibility": "float",
    "coverage": "float",
    "rankScore": "float",
    "matchedTraitCount": "int",
    "reasons": ["string"],
    "matchedTraits": [
      { "label": "string", "score": "int", "strength": "strong | neutral | weak" }
    ]
  }
]
```

---

## Table: user_favorites

Stores each user's saved/favorited majors. Composite unique constraint prevents duplicates.

| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| user_id | INTEGER | NOT NULL, FK → users(id) |
| major_id | INTEGER | NOT NULL, FK → majors(id) |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| | | UNIQUE(user_id, major_id) |

```json
{
  "id": "int",
  "user_id": "int",
  "major_id": "int",
  "created_at": "datetime"
}
```

---

## Relationships

```
users ──< quiz_profiles   (one user → one quiz profile, upserted)
users ──< user_favorites  (one user → many favorites)
majors ──< user_favorites (one major → many favorites)
```
