const { body, param, validationResult } = require('express-validator');

// Validation middleware to handle errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Validation failed',
                details: errors.array()
            }
        });
    }
    next();
};

// Request validation rules
const validateCreateRequest = [
    body('code')
        .notEmpty()
        .withMessage('Code is required')
        .isLength({ min: 1, max: 50 })
        .withMessage('Code must be between 1 and 50 characters'),
    body('summary')
        .notEmpty()
        .withMessage('Summary is required')
        .isLength({ min: 1, max: 50 })
        .withMessage('Summary must be between 1 and 50 characters'),
    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 1, max: 50 })
        .withMessage('Description must be between 1 and 50 characters'),
    body('employeeId')
        .notEmpty()
        .withMessage('Employee ID is required')
        .isInt({ min: 1 })
        .withMessage('Employee ID must be a positive integer'),
    handleValidationErrors
];

// Employee validation rules
const validateCreateEmployee = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 1, max: 50 })
        .withMessage('Name must be between 1 and 50 characters'),
    body('salary')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Salary must be a positive number'),
    body('hireDate')
        .optional()
        .isISO8601()
        .withMessage('Hire date must be a valid date'),
    handleValidationErrors
];

const validateUpdateEmployee = [
    body('name')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Name must be between 1 and 50 characters'),
    body('salary')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Salary must be a positive number'),
    body('hireDate')
        .optional()
        .isISO8601()
        .withMessage('Hire date must be a valid date'),
    handleValidationErrors
];

// ID parameter validation
const validateId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID must be a positive integer'),
    handleValidationErrors
];

// Auth validation rules
const validateRegister = [
    body('username')
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters'),
    body('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
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
        .withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

module.exports = {
    validateCreateRequest,
    validateCreateEmployee,
    validateUpdateEmployee,
    validateId,
    validateRegister,
    validateLogin,
    handleValidationErrors
};