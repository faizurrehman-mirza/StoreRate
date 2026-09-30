const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const pool = require('../../db');

// dashboard
// Returns total counts of users, stores, ratings
const getDashboard = async (req, res) => {
  try {
    const [usersCount, storesCount, ratingsCount] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM stores'),
      pool.query('SELECT COUNT(*) FROM ratings'),
    ]);

    res.status(200).json({
      totalUsers: parseInt(usersCount.rows[0].count),
      totalStores: parseInt(storesCount.rows[0].count),
      totalRatings: parseInt(ratingsCount.rows[0].count),
    });
  } catch (err) {
    console.error('Dashboard error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// user

const getAllUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy, order } = req.query;

    let query = `SELECT id, name, email, address, role, created_at FROM users WHERE 1=1`;

    const params = [];
    let paramCount = 1;

    if (name) {
      query += ` AND name ILIKE $${paramCount}`;
      params.push(`%${name}%`);
      paramCount++;
    }
    if (email) {
      query += ` AND email ILIKE $${paramCount}`;
      params.push(`%${email}%`);
      paramCount++;
    }
    if (address) {
      query += ` AND address ILIKE $${paramCount}`;
      params.push(`%${address}%`);
      paramCount++;
    }
    if (role) {
      query += ` AND role = $${paramCount}`;
      params.push(role);
      paramCount++;
    }

    const allowedSortFields = ['name', 'email', 'address', 'role', 'created_at'];
    const allowedOrders = ['asc', 'desc'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = allowedOrders.includes(order?.toLowerCase()) ? order.toUpperCase() : 'DESC';

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const result = await pool.query(query, params);
    res.status(200).json({ users: result.rows });

  } catch (err) {
    console.error('Get users error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Returns details of a single user, includes rating if store owner
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, name, email, address, role FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    // If the user is a store owner, also get their store's average rating
    if (user.role === 'store_owner') {
      const ratingResult = await pool.query(
        `SELECT ROUND(AVG(r.rating), 2) as average_rating
         FROM stores s
         LEFT JOIN ratings r ON s.id = r.store_id
         WHERE s.owner_id = $1`,
        [id]
      );
      user.average_rating = ratingResult.rows[0].average_rating || 0;
    }

    res.status(200).json({ user });

  } catch (err) {
    console.error('Get user by id error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// Admin adds a new user (any role)
const addUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, address, role } = req.body;

    // Check email not already taken
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1', [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, address, role`,
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0],
    });

  } catch (err) {
    console.error('Add user error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// stores

// Returns list of all stores with average rating, supports filter and sort
const getAllStores = async (req, res) => {
  try {
    const { name, email, address, sortBy, order } = req.query;

    let query = `
      SELECT s.id, s.name, s.email, s.address, s.owner_id,
             ROUND(AVG(r.rating), 2) as average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    if (name) {
      query += ` AND s.name ILIKE $${paramCount}`;
      params.push(`%${name}%`);
      paramCount++;
    }
    if (email) {
      query += ` AND s.email ILIKE $${paramCount}`;
      params.push(`%${email}%`);
      paramCount++;
    }
    if (address) {
      query += ` AND s.address ILIKE $${paramCount}`;
      params.push(`%${address}%`);
      paramCount++;
    }

    query += ` GROUP BY s.id`;

    const allowedSortFields = ['name', 'email', 'address', 'average_rating'];
    const allowedOrders = ['asc', 'desc'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 's.name';
    const sortOrder = allowedOrders.includes(order?.toLowerCase()) ? order.toUpperCase() : 'ASC';

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    const result = await pool.query(query, params);
    res.status(200).json({ stores: result.rows });

  } catch (err) {
    console.error('Get stores error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// Admin adds a new store
const addStore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, address, owner_id } = req.body;

    // Check email not already taken
    const existing = await pool.query(
      'SELECT id FROM stores WHERE email = $1', [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Store email already registered' });
    }

    // If owner_id provided, make sure that user exists and is a store_owner
    if (owner_id) {
      const ownerCheck = await pool.query(
        'SELECT id FROM users WHERE id = $1 AND role = $2',
        [owner_id, 'store_owner']
      );
      if (ownerCheck.rows.length === 0) {
        return res.status(400).json({
          message: 'owner_id must belong to a user with store_owner role'
        });
      }
    }

    const result = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, address, owner_id`,
      [name, email, address, owner_id || null]
    );

    res.status(201).json({
      message: 'Store created successfully',
      store: result.rows[0],
    });

  } catch (err) {
    console.error('Add store error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboard,
  getAllUsers,
  getUserById,
  addUser,
  getAllStores,
  addStore,
};
