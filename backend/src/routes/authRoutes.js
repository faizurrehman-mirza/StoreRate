const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validations/authValidation');

// POST /api/auth/register
router.post('/register', registerValidation, register);

// POST /api/auth/login
router.post('/login', loginValidation, login);

module.exports = router;
