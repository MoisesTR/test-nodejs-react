const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../../src/utils/jwt');

// Create a test-specific Prisma client
const getTestPrisma = () => {
  if (!global.testPrisma) {
    global.testPrisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'postgresql://admin:password@localhost:5432/employee_management_test'
        }
      }
    });
  }
  return global.testPrisma;
};

const createTestUser = async (role = 'employee') => {
  const prisma = getTestPrisma();
  const passwordHash = await bcrypt.hash('testpassword', 12);
  const id = Date.now();

  return await prisma.user.create({
    data: {
      username: `test${id}`,
      email: `test${id}@test.com`,
      passwordHash,
      role
    }
  });
};

const createTestEmployee = async (userId) => {
  const prisma = getTestPrisma();
  const id = Date.now();

  return await prisma.employee.create({
    data: {
      name: `Test Employee ${id}`,
      hireDate: new Date('2023-01-01'),
      salary: 50000,
      userId
    }
  });
};

const createTestRequest = async (employeeId) => {
  const prisma = getTestPrisma();
  const id = Date.now();

  // If no employeeId provided, create a test employee first
  let targetEmployeeId = employeeId;
  if (!targetEmployeeId) {
    const employee = await createTestEmployee();
    targetEmployeeId = employee.id;
  }

  return await prisma.request.create({
    data: {
      code: `TEST-${id}`,
      summary: 'Test Request',
      description: 'Test description',
      employeeId: targetEmployeeId
    },
    include: {
      employee: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

// Generate JWT token for testing
const generateTestToken = (userId, role = 'employee') => {
  return generateToken({ id: userId, role });
};

// Create authenticated request headers
const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

module.exports = {
  createTestUser,
  createTestEmployee,
  createTestRequest,
  generateTestToken,
  getAuthHeaders,
  getTestPrisma
};