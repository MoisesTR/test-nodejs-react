const express = require('express');
const { 
  getEmployees, 
  getEmployee, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee 
} = require('../controllers/employeeController');
const { validateEmployee } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin, requireEmployee } = require('../middleware/roleAuth');

const router = express.Router();

router.get('/', authenticateToken, requireEmployee, getEmployees);
router.get('/:id', authenticateToken, requireEmployee, getEmployee);
router.post('/', authenticateToken, requireAdmin, validateEmployee, createEmployee);
router.put('/:id', authenticateToken, requireAdmin, validateEmployee, updateEmployee);
router.delete('/:id', authenticateToken, requireAdmin, deleteEmployee);

module.exports = router;