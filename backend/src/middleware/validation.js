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
    body('code').notEmpty().isLength({ max: 50 }),
    body('summary').notEmpty().isLength({ max: 50 }),
    body('description').notEmpty().isLength({ max: 50 }),
    body('employeeId').isInt({ min: 1 }),
    handleValidationErrors
];

// Employee validation rules
const validateCreateEmployee = [
    body('name').notEmpty().isLength({ max: 50 }),
    body('salary').optional().isFloat({ min: 0 }),
    body('hireDate').optional().isISO8601(),
    handleValidationErrors
];

const validateUpdateEmployee = [
    body('name').optional().isLength({ max: 50 }),
    body('salary').optional().isFloat({ min: 0 }),
    body('hireDate').optional().isISO8601(),
    handleValidationErrors
];

// ID parameter validation
const validateId = [
    param('id').isInt({ min: 1 }),
    handleValidationErrors
];

// Auth validation rules
const validateRegister = [
    body('username').notEmpty().isLength({ min: 3, max: 50 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['employee', 'administrator']),
    handleValidationErrors
];

const validateLogin = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
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