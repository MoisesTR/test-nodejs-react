const express = require('express');
const {
  getRequests,
  getRequest,
  createRequest,
  deleteRequest
} = require('../controllers/requestController');
const { validateCreateRequest, validateId } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin, requireEmployee } = require('../middleware/roleAuth');
const router = express.Router();

router.get('/', authenticateToken, requireEmployee, getRequests);
router.get('/:id', authenticateToken, requireEmployee, validateId, getRequest);
router.post('/', authenticateToken, requireAdmin, validateCreateRequest, createRequest);
router.delete('/:id', authenticateToken, requireAdmin, validateId, deleteRequest);

module.exports = router;