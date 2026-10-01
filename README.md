# Roxiler Store Rating - Full Stack Intern Coding Challenge

Tech stack required by the challenge:
- Frontend: React.js
- Backend: Express.js
- Database: MySQL

## Features
- One login system with 3 roles: SYSTEM_ADMIN, NORMAL_USER, STORE_OWNER
- Normal user signup/login
- Admin dashboard: totals, users, stores, filters, sorting, user/store details
- Normal user: store search, overall rating, own rating, submit/update rating
- Store owner: users who rated the store + average rating
- Password update
- Rating validation 1-5
- Name 20-60 chars, address max 400 chars
- Password 8-16 chars, at least one uppercase and one special character
- Email validation
- JWT authentication and role-based authorization

## Requirements
- Node.js 18+
- MySQL 8+

## 1. Database
Create the database:
```sql
CREATE DATABASE roxiler_store_rating;
```

Then run:
```bash
mysql -u root -p roxiler_store_rating < backend/schema.sql
```

Seed demo accounts/data:
```bash
cd backend
npm install
npm run seed
```

Demo passwords:
- Admin: Admin@123
- User: User@123
- Store owner: Owner@123

## 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env with your MySQL username/password
npm run dev
```
Backend runs at http://localhost:5000

## 3. Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at the URL printed by Vite (normally http://localhost:5173).

## API
POST /api/auth/signup
POST /api/auth/login
PUT /api/auth/password

GET /api/admin/dashboard
GET /api/admin/users
POST /api/admin/users
GET /api/admin/stores
POST /api/admin/stores
GET /api/admin/users/:id

GET /api/stores
GET /api/stores/:id
POST /api/stores/:id/rating
PUT /api/stores/:id/rating

GET /api/owner/dashboard

GET /api/health
