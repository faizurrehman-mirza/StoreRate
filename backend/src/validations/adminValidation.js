const { body } = require('express-validator');

// Validation for admin adding a new user
const addUserValidation = [
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

  body('role')
    .isIn(['admin', 'user', 'store_owner'])
    .withMessage('Role must be admin, user, or store_owner'),
];

// Validation for admin adding a new store
const addStoreValidation = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Store name must be between 20 and 60 characters'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('address')
    .optional()
    .isLength({ max: 400 })
    .withMessage('Address must be under 400 characters'),

  body('owner_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('owner_id must be a valid number'),
];

module.exports = { addUserValidation, addStoreValidation };
