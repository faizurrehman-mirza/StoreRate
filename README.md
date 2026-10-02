# StoreRate

A full-stack web application that allows users to submit ratings (1–5) for stores registered on the platform. Built with Express.js, PostgreSQL, React.js, and Tailwind CSS.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Express.js (Node.js) |
| Database | PostgreSQL |
| Frontend | React.js + Vite |
| Styling | Tailwind CSS v4 |
| Auth | JWT (JSON Web Tokens) |
| Password Hashing | bcryptjs |

---

## User Roles

| Role | Description |
|------|-------------|
| **System Administrator** | Manages users and stores, views platform statistics |
| **Normal User** | Views stores, searches, submits and updates ratings |
| **Store Owner** | Views their store's ratings and average score |

---

## Features

### System Administrator
- Dashboard with total users, stores, and ratings count
- Add new users (admin, normal user, store owner)
- Add new stores and assign them to store owners
- View and filter users by name, email, address, role
- View and filter stores by name, email, address
- Sort all tables by any column (ascending/descending)
- View individual user details
- Change password and logout

### Normal User
- Register and login
- View all registered stores
- Search stores by name and address
- Submit a rating (1–5) for any store
- Update their previously submitted rating
- Change password and logout

### Store Owner
- Login (account created by admin)
- View their store's average rating
- View list of all users who rated their store
- Change password and logout

---

## Form Validations

| Field | Rule |
|-------|------|
| Name | Min 20 characters, Max 60 characters |
| Email | Must be a valid email format |
| Password | 8–16 characters, at least one uppercase letter and one special character |
| Address | Max 400 characters (optional) |
| Rating | Must be between 1 and 5 |

---

## Project Structure

```
StoreRate/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── validations/
│   ├── db.js          # PostgreSQL connection
│   ├── migrate.js     # Manual migration script
│   ├── seed.js        # Creates default admin on first run
│   ├── server.js      # Entry point (auto-migrates + seeds on start)
│   ├── .env           # Your config (never committed)
│   ├── .env.example   # Template for .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── context/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── user/
│   │   │   └── storeowner/
│   │   └── routes/
│   └── package.json
│
└── README.md
```

---

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- [PostgreSQL](https://www.postgresql.org/download) v14 or higher

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/StoreRate.git
cd StoreRate
```

---

### Step 2 — Create the Database

Open **pgAdmin** or **psql** and run:

```sql
CREATE DATABASE storerate;
```

That's the only SQL you need to run manually. Everything else is automatic.

---

### Step 3 — Backend Setup

```bash
cd backend
npm install
```

Copy the example env file and fill in your details:

```bash
cp .env.example .env
```

Open `.env` and update these values:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=storerate
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
JWT_SECRET=your_generated_secret_here
PORT=5000
```

To generate a secure JWT secret, run this in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET` value.

Start the backend:

```bash
npm run dev
```

On first run you will see:
```
Server running on port 5000
Database tables ready
=========================================
Default admin account created
Email:    admin@storerate.com
Password: Admin@1234
=========================================
```

> Tables are created automatically. Default admin is created automatically on first run.

---

### Step 4 — Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

App runs at: **http://localhost:5173**

---

### Step 5 — Login as Admin

Go to `http://localhost:5173/login` and use:

```
Email:    admin@storerate.com
Password: Admin@1234
```

> Change this password immediately after first login via the "Change Password" link in the navbar.

---

### Step 6 — Create Store Owner and Store

1. Login as admin
2. Go to **Users tab** → click **Add User** → select role **Store Owner**
3. Go to **Stores tab** → click **Add Store** → select the owner from the dropdown

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register normal user |
| POST | /api/auth/login | Public | Login all roles |
| PUT | /api/auth/update-password | Logged in | Update password |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/dashboard | Stats totals |
| GET | /api/admin/users | List users (filter + sort) |
| GET | /api/admin/users/:id | User details |
| POST | /api/admin/users | Create user |
| GET | /api/admin/stores | List stores (filter + sort) |
| POST | /api/admin/stores | Create store |

### Stores & Ratings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/stores | Normal User | View all stores |
| POST | /api/ratings | Normal User | Submit rating |
| PUT | /api/ratings/:store_id | Normal User | Update rating |
| GET | /api/ratings/my-store | Store Owner | View store ratings |

---

## Available Scripts

### Backend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start with auto-reload (nodemon) |
| `npm start` | Start without auto-reload |
| `npm run migrate` | Manually create tables |

### Frontend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |

---

## Database Schema

### users
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PRIMARY KEY | Auto increment |
| name | VARCHAR(60) | Min 20 chars |
| email | VARCHAR(255) | Unique |
| password | VARCHAR(255) | bcrypt hashed |
| address | VARCHAR(400) | Optional |
| role | VARCHAR(20) | admin / user / store_owner |
| created_at | TIMESTAMP | Auto set |

### stores
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PRIMARY KEY | Auto increment |
| name | VARCHAR(60) | Min 20 chars |
| email | VARCHAR(255) | Unique |
| address | VARCHAR(400) | Optional |
| owner_id | INTEGER | FK → users.id |
| created_at | TIMESTAMP | Auto set |

### ratings
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PRIMARY KEY | Auto increment |
| user_id | INTEGER | FK → users.id |
| store_id | INTEGER | FK → stores.id |
| rating | INTEGER | 1 to 5 |
| created_at | TIMESTAMP | Auto set |
| UNIQUE | (user_id, store_id) | One rating per user per store |
