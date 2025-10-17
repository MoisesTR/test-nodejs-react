const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../../src/middleware/auth');
const { createTestUser } = require('../utils/testHelpers');
const { generateToken } = require('../../src/utils/jwt');

describe('Authentication Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('authenticateToken', () => {
    it('should authenticate valid token', async () => {
      const user = await createTestUser();
      const token = generateToken({ userId: user.id, role: user.role });

      mockReq.headers.authorization = `Bearer ${token}`;

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.userId).toBe(user.id);
      expect(mockReq.user.role).toBe(user.role);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should reject missing authorization header', async () => {
      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { message: 'Access token required', code: 'TOKEN_REQUIRED' }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject malformed authorization header', async () => {
      mockReq.headers.authorization = 'InvalidFormat token';

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { message: 'Invalid or expired token', code: 'INVALID_TOKEN' }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject invalid token', async () => {
      mockReq.headers.authorization = 'Bearer invalid-token';

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { message: 'Invalid or expired token', code: 'INVALID_TOKEN' }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject expired token', async () => {
      const user = await createTestUser();
      const expiredToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '-1h' } // Expired 1 hour ago
      );

      mockReq.headers.authorization = `Bearer ${expiredToken}`;

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { message: 'Invalid or expired token', code: 'INVALID_TOKEN' }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});