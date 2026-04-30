---
title: "College Major Finder"
subtitle: "User Feature Workflows for Demonstration"
author: "CIS 325 Term Project"
date: "April 30, 2026"
---

# User Feature Workflows

## Purpose
This document provides step-by-step workflows for demonstrating each major user-facing feature in College Major Finder.

## Demo Environment Checklist
Before starting feature demos:

1. Start backend API:
   - `npm run server`
2. Start frontend app:
   - `npm run dev`
3. Open app in browser:
   - `http://localhost:5173`
4. Ensure database is initialized:
   - `node src/Backend/initDb.js`
   - `node src/Backend/initMajorDb.js`

---

## Workflow 1: Register a New Account

### Goal
Create a new user account using a Murray State email address.

### Steps
1. Navigate to `/register`.
2. Enter a display name.
3. Enter a valid `@murraystate.edu` email.
4. Enter a password with at least 6 characters.
5. Re-enter the same password in Confirm Password.
6. Click **Create Account**.
7. Observe success message and automatic redirect to login page.

### Expected Outcome
- Account is created successfully.
- User is redirected to `/login`.

### Validation Demo (Optional)
1. Enter non-Murray email (for example, `user@gmail.com`).
2. Submit the form.
3. Confirm validation error appears.

---

## Workflow 2: Sign In and Protected Routing

### Goal
Authenticate a user and access protected pages.

### Steps
1. Navigate to `/login`.
2. Enter registered `@murraystate.edu` email and password.
3. Click **Sign In**.
4. Confirm user is redirected to `/dashboard`.
5. Open a new tab and directly access `/quiz`.
6. Confirm page is accessible while signed in.
7. Click **Sign Out** in header.
8. Attempt to browse to `/dashboard` or `/quiz` directly.

### Expected Outcome
- Signed-in users access protected routes.
- Signed-out users are redirected to `/login`.

---

## Workflow 3: Forgot Password and Reset Flow

### Goal
Reset password through two-step forgot-password process.

### Steps
1. On login page, click **Forgot your password?**
2. Enter registered `@murraystate.edu` email.
3. Click **Continue**.
4. Enter a new password.
5. Confirm new password.
6. Click **Update Password**.
7. Observe success message and redirect to login page.
8. Sign in with the new password to verify reset succeeded.

### Expected Outcome
- Password is updated successfully.
- User can authenticate using new password.

---

## Workflow 4: Explore Majors with Search and Filters

### Goal
Browse and narrow majors using search and filter controls.

### Steps
1. Sign in and open `/dashboard`.
2. Review top statistic cards (Total Majors, Colleges, Departments, Saved Majors).
3. In search box, enter a keyword (for example, `computer`).
4. Select a specific college from College dropdown.
5. Select a specific department from Department dropdown.
6. Click an interest tag chip (for example, **STEM**).
7. Confirm results count and major grid update based on criteria.
8. Clear or change filters to show dynamic update behavior.

### Expected Outcome
- Major list updates immediately for search term, college, department, and interest tag filters.

---

## Workflow 5: Learn More Details for a Major

### Goal
Show expanded detail panel for a major card.

### Steps
1. On dashboard, select any major card.
2. Click **Learn More**.
3. Review displayed details:
   - High-paying career paths with salary information.
   - Key skills developed in that major.
   - External curriculum/program link.
4. Click **Hide Details** to collapse panel.

### Expected Outcome
- Detail section expands and collapses correctly per selected major.

---

## Workflow 6: Save and View Favorite Majors

### Goal
Add and remove favorite majors and filter to favorites only.

### Steps
1. On dashboard, click heart icon (`♡`) on one or more majors.
2. Confirm icon switches to filled (`♥`).
3. Verify **Saved Majors** stat count increases.
4. Click **Saved Majors** stat card.
5. Confirm grid shows only favorited majors.
6. Click heart icon on a saved major to remove it.
7. Confirm count updates and item is removed from favorites-only view.
8. Toggle **Saved Majors** stat card again to return to full list.

### Expected Outcome
- Favorites persist and display correctly.
- Favorites-only mode filters data correctly.

---

## Workflow 7: Compare Up to Three Majors

### Goal
Use comparison panel to evaluate majors side-by-side.

### Steps
1. On dashboard, click **+ Compare** on first major.
2. Click **+ Compare** on second major.
3. Optionally add a third major.
4. Observe comparison panel at bottom:
   - College
   - Department
   - Interest area
   - Top careers
   - Key skills
5. Attempt to add a fourth major.
6. Confirm additional selection is blocked.
7. Remove one compared major using **×** in panel.
8. Click **Clear All** to reset comparison panel.

### Expected Outcome
- Comparison panel supports 2 to 3 majors.
- Maximum of 3 majors is enforced.

---

## Workflow 8: Quiz Ranking and Personalized Match Results

### Goal
Generate ranked major recommendations based on interest ratings.

### Steps
1. From dashboard, click **Go to Quiz**.
2. Rate each quiz statement from 1 to 5.
3. Click **Rank My Majors**.
4. Review ranked match list (top 12 majors):
   - Rank position
   - Match score
   - Trait match count
   - Top aligned reasons
5. For one result, click **Why this matched you**.
6. Review trait-level score bars and strength labels.

### Expected Outcome
- Results render in ranked order.
- Explanation panel shows trait-level reasoning.

---

## Workflow 9: Save Quiz Profile and Verify Persistence

### Goal
Persist quiz answers/results and restore them after new login session.

### Steps
1. In quiz page, after ranking results, click **Save Profile**.
2. Confirm success status message appears.
3. Click **Sign Out**.
4. Sign back in with same account.
5. Navigate to `/quiz`.
6. Confirm prior answers and results are restored automatically.

### Expected Outcome
- Quiz profile data persists in database.
- Returning user sees prior quiz state without re-entry.

---

## Workflow 10: End-to-End User Journey (Full Demo)

### Goal
Demonstrate complete app value from account setup to decision support.

### Steps
1. Register a new account.
2. Sign in to dashboard.
3. Search/filter majors to narrow choices.
4. Open **Learn More** for 2 to 3 majors.
5. Favorite preferred majors.
6. Compare top majors side-by-side.
7. Take quiz and generate ranked matches.
8. Open **Why this matched you** for explanation transparency.
9. Save quiz profile.
10. Sign out and sign back in.
11. Confirm saved favorites and quiz profile are retained.

### Expected Outcome
- Demonstrates full workflow: discover, evaluate, compare, personalize, and persist.

---

## Suggested Live Demo Order
For a smooth classroom or stakeholder presentation:

1. Sign Up + Validation
2. Sign In + Protected Routes
3. Dashboard Search/Filters + Learn More
4. Favorites + Compare
5. Quiz + Why Matched
6. Save Profile + Persistence Check
7. Full End-to-End recap

## Notes for Presenter
- Keep one pre-seeded test account ready as backup.
- If network/API delay occurs, mention loading/error handling behavior.
- Use at least one validation failure intentionally to demonstrate guardrails.
- Keep a short script with exact filter terms (example: `computer`, `business`, `education`) to avoid dead time.
