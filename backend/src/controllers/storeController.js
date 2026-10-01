const pool = require('../../db');

// GET /api/stores
// Normal user views all stores, can search by name and address
const getAllStores = async (req, res) => {
  try {
    const { name, address, sortBy, order } = req.query;

    // For each store, also get:
    // The overall average rating and the current user's submitted rating if any
    let query = `
      SELECT
        s.id,
        s.name,
        s.address,
        s.email,
        ROUND(AVG(r.rating), 2) as average_rating,
        MAX(CASE WHEN r.user_id = $1 THEN r.rating END) as my_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;

    // $1 is always the logged in user's id
    // so we track params from $2 onwards for filters
    const params = [req.user.id];
    let paramCount = 2;

    if (name) {
      query += ` AND s.name ILIKE $${paramCount}`;
      params.push(`%${name}%`);
      paramCount++;
    }

    if (address) {
      query += ` AND s.address ILIKE $${paramCount}`;
      params.push(`%${address}%`);
      paramCount++;
    }

    query += ` GROUP BY s.id`;

    // Sorting
    const allowedSortFields = ['name', 'address', 'average_rating'];
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

module.exports = { getAllStores };
