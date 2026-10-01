# ⭐ Roxiler Store Rating Platform

A full-stack **Store Rating Platform** built for the FullStack Intern Coding Challenge. The application provides a single authentication system with role-based access for **System Administrators, Normal Users, and Store Owners**.

Users can discover stores, submit ratings from **1 to 5**, and update their submitted ratings. Administrators can manage users and stores, while store owners can monitor ratings and view users who rated their store.

---

## 📸 Screenshots

### Login

![Login Page](docs/screenshots/login.png)

### Admin Dashboard

![Admin Dashboard](docs/screenshots/admin-dashboard.png)

> More screenshots can be added to `docs/screenshots/` as the project UI is extended.

---

## ✨ Features

### 🔐 Authentication & Authorization

- Single login system for all application roles
- JWT-based authentication
- Role-based authorization
- Normal user signup
- Secure password update flow
- Logout support

### 👨‍💼 System Administrator

- Dashboard with total users, stores, and submitted ratings
- View users and stores
- Search/filter users and stores
- Sort important listing fields
- Add users and stores through the backend API
- View user details
- Role-aware access control

### 👤 Normal User

- Create an account
- View registered stores
- Search stores by name or address
- View overall store rating
- View their own submitted rating
- Submit a rating from 1–5
- Update an existing rating
- Change password

### 🏪 Store Owner

- View store rating information
- View average rating
- View users who submitted ratings for the store
- Change password

### ✅ Validation

- Name: minimum 20 and maximum 60 characters
- Address: maximum 400 characters
- Password: 8–16 characters, including at least one uppercase letter and one special character
- Standard email validation
- Rating limited to 1–5

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite |
| Backend | Node.js + Express.js |
| Database | MySQL 8+ |
| Authentication | JWT |
| API style | REST |
| Styling | CSS |
| Development | VS Code / npm |

---

## 🏗️ Project Structure

```text
Roxiler-Store-Rating-Project/
│
├── backend/
│   ├── src/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── db.js
│   │   ├── middleware.js
│   │   ├── owner.js
│   │   ├── seed.js
│   │   ├── server.js
│   │   ├── stores.js
│   │   └── validation.js
│   ├── schema.sql
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   ├── index.html
│   └── vite.config.js
│
├── docs/
│   └── screenshots/
│       ├── login.png
│       └── admin-dashboard.png
│
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

Install the following before running the project:

- **Node.js 18+**
- **MySQL 8+**
- **Git**
- **VS Code** (recommended)

---

## 🚀 Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/Roxiler-Store-Rating-Project.git
cd Roxiler-Store-Rating-Project
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Create the MySQL database

Open MySQL Workbench or the MySQL CLI and run:

```sql
CREATE DATABASE roxiler_store_rating;
```

Then execute `backend/schema.sql` against the new database.

If you are using the MySQL CLI:

```bash
mysql -u root -p roxiler_store_rating < backend/schema.sql
```

### 3. Configure the backend

Open a terminal in the `backend` folder:

```bash
cd backend
npm install
```

Create a `.env` file by copying `.env.example`.

Example:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=roxiler_store_rating
JWT_SECRET=your_secure_jwt_secret
```

**Do not commit `.env` to GitHub.** It is already excluded through `.gitignore`.

### 4. Add demo data

From the `backend` folder:

```bash
npm run seed
```

### 5. Start the backend

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Keep this terminal running.

### 6. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite normally starts the frontend at:

```text
http://localhost:5173
```

Open that address in your browser.

---

## 🔑 Demo Accounts

| Role | Email | Password |
|---|---|---|
| System Administrator | `admin@example.com` | `Admin@123` |
| Normal User | `user@example.com` | `User@123` |
| Store Owner | `owner@example.com` | `Owner@123` |

> These credentials are for local/demo use only. Change passwords for any real deployment.

---

## 🔌 API Overview

### Authentication

```text
POST /api/auth/signup
POST /api/auth/login
PUT  /api/auth/password
```

### Administrator

```text
GET  /api/admin/dashboard
GET  /api/admin/users
POST /api/admin/users
GET  /api/admin/stores
POST /api/admin/stores
GET  /api/admin/users/:id
```

### Stores & Ratings

```text
GET  /api/stores
GET  /api/stores/:id
POST /api/stores/:id/rating
PUT  /api/stores/:id/rating
```

### Store Owner

```text
GET /api/owner/dashboard
```

### Health Check

```text
GET /api/health
```

---

## 🔄 Application Flow

```text
User opens React application
          ↓
       Login / Signup
          ↓
     JWT authentication
          ↓
    Role-based dashboard
      ↙      ↓       ↘
   Admin    User    Owner
      ↓      ↓       ↓
 Manage    Rate    Monitor
 users &   stores   ratings
 stores
```

---

## 🔒 Security Notes

- JWT is used for authentication.
- Protected routes require authentication and role checks.
- Database credentials are stored in `.env`.
- `.env` and `node_modules` are excluded from Git through `.gitignore`.
- Demo credentials should not be reused in production.

---

## 📌 Challenge Requirements Covered

The implementation follows the challenge's requested stack and core role-based store-rating workflow:

- React.js frontend
- Express.js backend
- MySQL database
- Three application roles
- Store ratings from 1–5
- User/store management flows
- Store search and rating update
- Store-owner rating dashboard
- Validation rules
- Sorting/filtering support
- Authentication and authorization

---

## 👨‍💻 Author

**Roxiler Store Rating — Full Stack Intern Coding Challenge**

Built as a full-stack web application using React, Express.js, and MySQL.
