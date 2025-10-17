const { PrismaClient } = require('@prisma/client');
const { getPaginatedData } = require('../utils/pagination');

const prisma = new PrismaClient();

const getEmployees = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'administrator';
    
    const result = await getPaginatedData(
      req,
      (params) => prisma.employee.findMany({
        ...params,
        select: {
          id: true,
          name: true,
          hireDate: true,
          createdAt: true,
          ...(isAdmin && { salary: true }) // Only show salary to admins
        }
      }),
      () => prisma.employee.count(),
      {
        defaultLimit: 10,
        maxLimit: 50,
        defaultOrderBy: { id: 'desc' }
      }
    );

    res.json({
      success: true,
      data: {
        employees: result.data,
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasNext: result.hasNext,
        hasPrev: result.hasPrev
      }
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to fetch employees' } });
  }
};

const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user.role === 'administrator';
    
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        hireDate: true,
        createdAt: true,
        ...(isAdmin && { salary: true }) // Only show salary to admins
      }
    });

    if (!employee) {
      return res.status(404).json({ success: false, error: { message: 'Employee not found' } });
    }

    res.json({ success: true, data: { employee } });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to fetch employee' } });
  }
};

const createEmployee = async (req, res) => {
  try {
    const { name, hireDate, salary } = req.body;
    const employee = await prisma.employee.create({
      data: {
        name,
        hireDate: hireDate ? new Date(hireDate) : null,
        salary: salary ? parseFloat(salary) : null
      }
    });

    res.status(201).json({ success: true, data: { employee } });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to create employee' } });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, hireDate, salary } = req.body;

    const employee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: {
        name,
        hireDate: hireDate ? new Date(hireDate) : null,
        salary: salary ? parseFloat(salary) : null
      }
    });

    res.json({ success: true, data: { employee } });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to update employee' } });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.employee.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, data: { message: 'Employee deleted' } });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ success: false, error: { message: 'Failed to delete employee' } });
  }
};

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
};