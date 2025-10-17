const { requireAdmin, requireEmployee } = require('../../src/middleware/roleAuth');

describe('Role Authorization Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      user: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('requireAdmin', () => {
    it('should allow administrator access', () => {
      mockReq.user = { userId: 1, role: 'administrator' };

      requireAdmin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should deny employee access', () => {
      mockReq.user = { userId: 1, role: 'employee' };

      requireAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { message: 'Insufficient permissions', code: 'INSUFFICIENT_PERMISSIONS' }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should deny access without user object', () => {
      mockReq.user = null;

      requireAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { message: 'Authentication required', code: 'AUTH_REQUIRED' }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should deny access with invalid role', () => {
      mockReq.user = { userId: 1, role: 'invalid' };

      requireAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireEmployee', () => {
    it('should allow administrator access', () => {
      mockReq.user = { userId: 1, role: 'administrator' };

      requireEmployee(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should allow employee access', () => {
      mockReq.user = { userId: 1, role: 'employee' };

      requireEmployee(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should deny access without user object', () => {
      mockReq.user = null;

      requireEmployee(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: { message: 'Authentication required', code: 'AUTH_REQUIRED' }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should deny access with invalid role', () => {
      mockReq.user = { userId: 1, role: 'invalid' };

      requireEmployee(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});