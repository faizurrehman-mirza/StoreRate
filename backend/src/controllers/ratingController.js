const pool = require('../../db');

// POST /api/ratings
// Normal user submits a rating for a store
const submitRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;

    // Validate rating value
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check the store exists
    const storeCheck = await pool.query(
      'SELECT id FROM stores WHERE id = $1', [store_id]
    );
    if (storeCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Check if user already rated this store
    const existing = await pool.query(
      'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
      [req.user.id, store_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: 'You already rated this store. Use PUT to update your rating.'
      });
    }

    // Insert the rating
    const result = await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, store_id, rating`,
      [req.user.id, store_id, rating]
    );

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: result.rows[0],
    });

  } catch (err) {
    console.error('Submit rating error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// Normal user updates their existing rating for a store
const updateRating = async (req, res) => {
  try {
    const { store_id } = req.params;
    const { rating } = req.body;

    // Validate rating value
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check the rating exists and belongs to this user
    const existing = await pool.query(
      'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
      [req.user.id, store_id]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({
        message: 'No rating found. Submit a rating first.'
      });
    }

    // Update the rating
    const result = await pool.query(
      `UPDATE ratings SET rating = $1
       WHERE user_id = $2 AND store_id = $3
       RETURNING id, user_id, store_id, rating`,
      [rating, req.user.id, store_id]
    );

    res.status(200).json({
      message: 'Rating updated successfully',
      rating: result.rows[0],
    });

  } catch (err) {
    console.error('Update rating error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// Store owner views ratings for their store + average rating
const getMyStoreRatings = async (req, res) => {
  try {
    // Find the store that belongs to this owner
    const storeResult = await pool.query(
      'SELECT id, name FROM stores WHERE owner_id = $1',
      [req.user.id]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: 'No store found for this owner' });
    }

    const store = storeResult.rows[0];

    // Get all ratings for this store with user details
    const ratingsResult = await pool.query(
      `SELECT
         u.id as user_id,
         u.name as user_name,
         u.email as user_email,
         r.rating,
         r.created_at
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = $1
       ORDER BY r.created_at DESC`,
      [store.id]
    );

    // Get average rating
    const avgResult = await pool.query(
      'SELECT ROUND(AVG(rating), 2) as average_rating FROM ratings WHERE store_id = $1',
      [store.id]
    );

    res.status(200).json({
      store: store.name,
      average_rating: avgResult.rows[0].average_rating || 0,
      total_ratings: ratingsResult.rows.length,
      ratings: ratingsResult.rows,
    });

  } catch (err) {
    console.error('Get store ratings error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitRating, updateRating, getMyStoreRatings };
