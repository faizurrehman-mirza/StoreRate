const express = require('express');
const router = express.Router();

const { getAllStores } = require('../controllers/storeController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');


router.get('/', authenticate, authorizeRoles('user'), getAllStores);

module.exports = router;
