const rateLimit = require('express-rate-limit');

// Strict rate limiter for login attempts (prevent brute force)
const loginLimiter = process.env.NODE_ENV === 'test'
    ? (req, res, next) => next() // Skip rate limiting in tests
    : rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10, // Limit each IP to 10 login attempts per windowMs
        message: {
            success: false,
            error: {
                message: 'Too many login attempts, please try again in 15 minutes',
                code: 'LOGIN_RATE_LIMIT_EXCEEDED'
            }
        },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: true, // Don't count successful logins
    });


module.exports = {
    loginLimiter,
};