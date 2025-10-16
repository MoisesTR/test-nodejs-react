const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@company.com',
      passwordHash: adminPassword,
      role: 'administrator',
    },
  });

  // Create employee user
  const employeePassword = await bcrypt.hash('employee123', 12);
  await prisma.user.upsert({
    where: { email: 'john.doe@company.com' },
    update: {},
    create: {
      username: 'johndoe',
      email: 'john.doe@company.com',
      passwordHash: employeePassword,
      role: 'employee',
    },
  });

  // Get the created users
  const johnUser = await prisma.user.findUnique({
    where: { email: 'john.doe@company.com' }
  });

  // Create employees
  const employee1 = await prisma.employee.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'John Doe',
      hireDate: new Date('2023-01-15'),
      salary: 75000.00,
      userId: johnUser.id,
    },
  });

  const employee2 = await prisma.employee.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Jane Smith',
      hireDate: new Date('2022-08-20'),
      salary: 68000.00,
    },
  });

  // Create sample requests
  await prisma.request.create({
    data: {
      code: 'REQ-001',
      description: 'Requesting time off for vacation from Dec 20-24',
      summary: 'Vacation Request',
      employeeId: employee1.id,
    },
  });

  await prisma.request.create({
    data: {
      code: 'REQ-002',
      description: 'Need new laptop and monitor for development work',
      summary: 'Equipment Request',
      employeeId: employee2.id,
    },
  });

  console.log('Database seeded successfully');
  console.log('Admin user: admin@company.com / admin123');
  console.log('Employee user: john.doe@company.com / employee123');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });