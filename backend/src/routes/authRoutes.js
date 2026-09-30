const express = require('express');
const router = express.Router();

const { register, login, updatePassword } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validations/authValidation');
const { authenticate } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', registerValidation, register);

// POST /api/auth/login
router.post('/login', loginValidation, login);

// PUT /api/auth/update-password  (protected - must be logged in)
router.put('/update-password', authenticate, updatePassword);


module.exports = router;
