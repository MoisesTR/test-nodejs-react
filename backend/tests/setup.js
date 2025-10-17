const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

// Test environment configuration
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://admin:password@localhost:5432/employee_management_test';

let prisma;

// Global test setup
beforeAll(async () => {
  console.log('🔧 Initializing test database...');

  // Initialize Prisma client
  prisma = new PrismaClient();

  try {
    // First, try to create the test database if it doesn't exist
    console.log('🗄️  Ensuring test database exists...');
    try {
      execSync('docker compose exec -T database psql -U admin -d postgres -c "CREATE DATABASE employee_management_test;" 2>/dev/null || true', {
        stdio: 'pipe'
      });
    } catch (e) {
      // Database might already exist, continue
    }

    // Run migrations on test database
    console.log('📋 Running migrations...');
    execSync('npx prisma migrate deploy', {
      env: { ...process.env },
      stdio: 'pipe'
    });

    // Connect to test database
    await prisma.$connect();
    console.log('✅ Test database connected!');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('💡 Make sure PostgreSQL is running: npm run test:setup');
    throw error;
  }
}, 30000);

// Clean up after each test
afterEach(async () => {
  if (prisma) {
    try {
      // Clean up test data in reverse order to avoid foreign key constraints
      await prisma.request.deleteMany();
      await prisma.employee.deleteMany();
      await prisma.user.deleteMany();
      
      // Note: Sequence reset removed as it was causing foreign key issues
    } catch (error) {
      console.warn('⚠️  Cleanup warning:', error.message);
    }
  }
});

// Global test teardown
afterAll(async () => {
  if (prisma) {
    await prisma.$disconnect();
    console.log('🔌 Disconnected from test database');
  }
});

// Make prisma available globally in tests
global.prisma = prisma;