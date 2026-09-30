const { body } = require('express-validator');

// SignUp
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),

  body('address')
    .optional()
    .isLength({ max: 400 })
    .withMessage('Address must be under 400 characters'),
];

// Login
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

module.exports = { registerValidation, loginValidation };
