# Store Rating Platform

A full-stack web application where registered users can view stores and submit ratings (1–5 stars). The app features a unified login system with Role-Based Access Control (RBAC) for System Administrators, Normal Users, and Store Owners.

## Tech Stack
- **Backend:** Express.js, Prisma ORM, SQLite (Development) / PostgreSQL (Production)
- **Frontend:** React (Vite), Tailwind CSS v4, React Router DOM v6
- **Authentication:** JSON Web Tokens (JWT) + bcryptjs

## Features
- **Public Registration:** Anyone can sign up as a Normal User.
- **Role-Based Access Control (RBAC):** Three distinct roles (`ADMIN`, `NORMAL_USER`, `STORE_OWNER`) sharing a single login endpoint.
- **Admin Dashboard:** Full control over the system. Admins can view statistics, manage all users, and manually create Stores and Store Owners.
- **User Dashboard:** Browse stores with dynamic search and sorting, view overall average ratings, and submit/upsert personal ratings out of 5 stars.
- **Store Owner Dashboard:** View your specific store's overall rating and see a real-time list of all users who have rated it.
- **Modern UI:** "Storefront warmth" design aesthetic using responsive Tailwind CSS utility classes.
- **Strict Validation:** Password complexity and input rules enforced on both the client (HTML5 Regex) and server (express-validator).

## Quick Start (Local Development)

### 1. Backend Setup
```bash
cd backend
npm install
# Generate Prisma Client and create local SQLite database
npx prisma generate
npx prisma db push
# Start the Express server (runs on port 5000)
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Start the Vite React server
npm run dev
```

## Seeding the Database
To quickly test the platform without manually registering every account type, you can seed the database with predefined test accounts.
```bash
cd backend
node seed.js
```
**Test Accounts Created (Password for all is `Test1234!`):**
- **Admin:** `admin@example.com`
- **Owner:** `owner@example.com`
- **User:** `user@example.com`
