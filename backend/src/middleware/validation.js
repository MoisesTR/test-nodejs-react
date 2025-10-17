const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors.array()
      }
    });
  }
  next();
};

const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['employee', 'administrator'])
    .withMessage('Role must be either employee or administrator'),
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

const validateEmployee = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('hireDate')
    .optional()
    .isISO8601()
    .withMessage('Hire date must be a valid date'),
  body('salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary must be a positive number'),
  body('userId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('User ID must be a positive integer'),
  handleValidationErrors
];

const validateRequest = [
  body('code')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Code is required and must be max 50 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Description is required and must be max 255 characters'),
  body('summary')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Summary is required and must be max 100 characters'),
  body('employeeId')
    .isInt({ min: 1 })
    .withMessage('Employee ID must be a positive integer'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateEmployee,
  validateRequest,
  handleValidationErrors
};