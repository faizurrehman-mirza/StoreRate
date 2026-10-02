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
| Containerization | Docker + Docker Compose |

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

## Running the App

There are two ways to run this project. Choose the one that works for you.

---

## Option 1 — Docker (Easiest — Recommended)

### Requirements
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/StoreRate.git
cd StoreRate
```

**2. Start everything with one command**
```bash
docker-compose up --build
```

This automatically:
- Creates the PostgreSQL database
- Creates all tables
- Creates the default admin account
- Starts the backend on port 5000
- Serves the frontend on port 80

**3. Open your browser**

Go to: **http://localhost**

**4. Login as admin**
```
Email:    admin@storerate.com
Password: Admin@1234
```

> Change this password immediately after first login.

### Docker Commands

```bash
# Start all containers
docker-compose up --build

# Start in background
docker-compose up -d --build

# Stop all containers
docker-compose down

# Stop and delete all data (fresh start)
docker-compose down -v

# View logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

---

## Option 2 — Manual Setup (Without Docker)

### Requirements
- [Node.js](https://nodejs.org) v20 or higher
- [PostgreSQL](https://www.postgresql.org/download) v14 or higher

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/StoreRate.git
cd StoreRate
```

**2. Create the database**

Open pgAdmin or psql and run:
```sql
CREATE DATABASE storerate;
```

That is the only SQL you need to run manually.

**3. Setup the backend**

```bash
cd backend
npm install
```

Copy the example env file:
```bash
cp .env.example .env
```

Open `.env` and fill in your values:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=storerate
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
JWT_SECRET=your_generated_secret_here
PORT=5000
```

Generate a secure JWT secret by running:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET`.

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

**4. Setup the frontend**

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

**5. Login as admin**

Go to `http://localhost:5173/login` and use:
```
Email:    admin@storerate.com
Password: Admin@1234
```

---

## Ports

| Mode | Frontend | Backend | Database |
|------|----------|---------|----------|
| Docker | http://localhost (port 80) | port 5000 | port 5432 |
| Manual | http://localhost:5173 | port 5000 | port 5432 |

---

## Project Structure

```
StoreRate/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Route logic
│   │   ├── routes/            # URL definitions
│   │   ├── middleware/        # JWT auth guards
│   │   └── validations/       # Input validation rules
│   ├── db.js                  # PostgreSQL connection
│   ├── migrate.js             # Manual migration script
│   ├── seed.js                # Creates default admin on first run
│   ├── server.js              # Entry point (auto-migrates + seeds)
│   ├── Dockerfile             # Docker image for backend
│   ├── .dockerignore
│   ├── .env                   # Your config (never committed)
│   ├── .env.example           # Template for .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios instance
│   │   ├── context/           # Auth context
│   │   ├── components/        # Navbar
│   │   ├── pages/
│   │   │   ├── admin/         # Admin dashboard + user detail
│   │   │   ├── user/          # User store listing
│   │   │   └── storeowner/    # Store owner dashboard
│   │   └── routes/            # App routes
│   ├── Dockerfile             # Docker image for frontend
│   ├── nginx.conf             # Nginx config for Docker
│   ├── .dockerignore
│   ├── .env.development       # Dev API URL (not committed)
│   └── package.json
│
├── docker-compose.yml         # Runs all 3 services together
└── README.md
```

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

### Stores and Ratings
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
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |

---

## After First Login

1. Change the default admin password via **Change Password** in the navbar
2. Go to **Users tab** → Add a Store Owner user
3. Go to **Stores tab** → Add a Store and assign the owner
4. The Store Owner can now login and see their store dashboard
5. Register as a Normal User to test store ratings
