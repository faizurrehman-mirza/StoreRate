const pool = require('./db');

const migrate = async () => {
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
    `);
    console.log('users table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(60)  NOT NULL CHECK (LENGTH(name) >= 20),
        email      VARCHAR(255) UNIQUE NOT NULL,
        address    VARCHAR(400),
        owner_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('stores table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        store_id   INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        rating     INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, store_id)
      )
    `);
    console.log('ratings table ready');

    console.log('All tables created successfully!');
    process.exit(0);

  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
};

migrate();
