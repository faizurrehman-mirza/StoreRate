const express = require('express');
const router = express.Router();

const { submitRating, updateRating, getMyStoreRatings } = require('../controllers/ratingController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// POST /api/ratings        - normal user submits a rating
router.post('/', authenticate, authorizeRoles('user'), submitRating);

// PUT /api/ratings/:store_id  - normal user updates their rating
router.put('/:store_id', authenticate, authorizeRoles('user'), updateRating);

// GET /api/ratings/my-store   - store owner views their store's ratings
router.get('/my-store', authenticate, authorizeRoles('store_owner'), getMyStoreRatings);

module.exports = router;
