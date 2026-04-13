# CollegeMajorFinder Database Schema

# app.db

# Table: users

Columns: id, email, password_hash, display_name, created_at

JSON format

```json
{
  "id": "int",
  "email": "string",
  "password_hash": "string",
  "display_name": "string",
  "created_at": "datetime"
}
```

## Table: majors

Columns: id, collegeOfMajor, Department, major

JSON format

```json
{
  "id": "int",
  "collegeOfMajor": "string",
  "Department": "string",
  "major": "string"
}
```
