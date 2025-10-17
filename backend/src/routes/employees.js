const express = require('express');
const { 
  getEmployees, 
  getEmployee, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee 
} = require('../controllers/employeeController');
const { validateCreateEmployee, validateUpdateEmployee, validateId } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin, requireEmployee } = require('../middleware/roleAuth');

const router = express.Router();

router.get('/', authenticateToken, requireEmployee, getEmployees);
router.get('/:id', authenticateToken, requireEmployee, validateId, getEmployee);
router.post('/', authenticateToken, requireAdmin, validateCreateEmployee, createEmployee);
router.put('/:id', authenticateToken, requireAdmin, validateId, validateUpdateEmployee, updateEmployee);
router.delete('/:id', authenticateToken, requireAdmin, validateId, deleteEmployee);

module.exports = router;