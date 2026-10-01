const bcrypt = require('bcryptjs')
const pool = require('./db')

const seedAdmin = async () => {
  try {
    // Check if any admin already exists
    const existing = await pool.query(
      "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
    )

    if (existing.rows.length > 0) {
      console.log('Admin already exists — skipping seed')
      return
    }

    // Create default admin account
    const hashedPassword = await bcrypt.hash('Admin@1234', 10)
    await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ($1, $2, $3, $4, 'admin')`,
      [
        'System Administrator Account',
        'admin@storerate.com',
        hashedPassword,
        'Admin Address'
      ]
    )

    console.log('=========================================')
    console.log('Default admin account created')
    console.log('Email:    admin@storerate.com')
    console.log('Password: Admin@1234')
    console.log('=========================================')
  } catch (err) {
    console.error('Seed failed:', err.message)
  }
}

module.exports = seedAdmin
