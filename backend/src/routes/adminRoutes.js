const express = require('express');
const router = express.Router();

const {
  getDashboard,
  getAllUsers,
  getUserById,
  addUser,
  getAllStores,
  addStore,
} = require('../controllers/adminController');

const { addUserValidation, addStoreValidation } = require('../validations/adminValidation');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticate);
router.use(authorizeRoles('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', addUserValidation, addUser);

// Stores
router.get('/stores', getAllStores);
router.post('/stores', addStoreValidation, addStore);

module.exports = router;
