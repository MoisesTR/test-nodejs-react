const express = require('express');
const { 
  getRequests, 
  getRequest, 
  createRequest, 
  deleteRequest 
} = require('../controllers/requestController');
const { validateRequest } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin, requireEmployee } = require('../middleware/roleAuth');

const router = express.Router();

router.get('/', authenticateToken, requireEmployee, getRequests);
router.get('/:id', authenticateToken, requireEmployee, getRequest);
router.post('/', authenticateToken, requireAdmin, validateRequest, createRequest);
router.delete('/:id', authenticateToken, requireAdmin, deleteRequest);

module.exports = router;