const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

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

// Create test user with unique identifiers to avoid conflicts
const createTestUser = async (role = 'employee') => {
  const prisma = getTestPrisma();
  const passwordHash = await bcrypt.hash('testpassword', 12);
  const timestamp = Date.now();
  const randomId = Math.floor(Math.random() * 1000);

  return await prisma.user.create({
    data: {
      username: `test${role}${timestamp}${randomId}`,
      email: `test${role}${timestamp}${randomId}@test.com`,
      passwordHash,
      role
    }
  });
};

// Create test employee
const createTestEmployee = async (userId) => {
  let actualUserId = userId;
  if (!actualUserId) {
    const testUser = await createTestUser();
    actualUserId = testUser.id;
  }
  const prisma = getTestPrisma();
  const timestamp = Date.now();
  const randomId = Math.floor(Math.random() * 1000);

  return await prisma.employee.create({
    data: {
      name: `Test Employee ${timestamp}${randomId}`,
      hireDate: new Date('2023-01-01'),
      salary: 50000,
      userId: actualUserId
    }
  });
};

// Create test request
const createTestRequest = async (employeeId) => {
  const prisma = getTestPrisma();
  const timestamp = Date.now();
  const randomId = Math.floor(Math.random() * 1000);

  let actualEmployeeId = employeeId;
  if (!actualEmployeeId) {
    const testEmployee = await createTestEmployee();
    actualEmployeeId = testEmployee.id;
  }

  return await prisma.request.create({
    data: {
      code: `TEST-${timestamp}-${randomId}`,
      summary: 'Test Request',
      description: 'Test request description',
      employeeId: actualEmployeeId
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
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
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