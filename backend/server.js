require('dotenv').config()

const express = require('express')
const cors = require('cors')
const pool = require('./db')
const seedAdmin = require('./seed')

const app = express()

app.use(cors())
app.use(express.json())

// Routes
const authRoutes = require('./src/routes/authRoutes')
const adminRoutes = require('./src/routes/adminRoutes')
const storeRoutes = require('./src/routes/storeRoutes')
const ratingRoutes = require('./src/routes/ratingRoutes')

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/stores', storeRoutes)
app.use('/api/ratings', ratingRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'StoreRate API is running' })
})

// Auto migrate — creates all tables if they don't exist
const autoMigrate = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(60)  NOT NULL CHECK (LENGTH(name) >= 20),
        email      VARCHAR(255) UNIQUE NOT NULL,
        password   VARCHAR(255) NOT NULL,
        address    VARCHAR(400),
        role       VARCHAR(20)  NOT NULL DEFAULT 'user'
                   CHECK (role IN ('admin', 'user', 'store_owner')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(60)  NOT NULL CHECK (LENGTH(name) >= 20),
        email      VARCHAR(255) UNIQUE NOT NULL,
        address    VARCHAR(400),
        owner_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        store_id   INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        rating     INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, store_id)
      )
    `)
    console.log('Database tables ready')
  } catch (err) {
    console.error('Migration failed:', err.message)
  }
}

const PORT = process.env.PORT || 5000
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`)
  await autoMigrate() // creates tables automatically
  await seedAdmin()   // creates default admin if none exists
})
