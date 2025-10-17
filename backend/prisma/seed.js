const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

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

  const johnUser = await prisma.user.findUnique({
    where: { email: 'john.doe@company.com' }
  });

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

  // Add more employees to test pagination
  const employees = [
    { name: 'Alice Johnson', hireDate: new Date('2023-03-10'), salary: 72000.00 },
    { name: 'Bob Wilson', hireDate: new Date('2023-05-15'), salary: 65000.00 },
    { name: 'Carol Brown', hireDate: new Date('2022-11-08'), salary: 78000.00 },
    { name: 'David Lee', hireDate: new Date('2023-07-22'), salary: 70000.00 },
    { name: 'Emma Davis', hireDate: new Date('2023-02-14'), salary: 73000.00 },
    { name: 'Frank Miller', hireDate: new Date('2022-09-30'), salary: 69000.00 },
    { name: 'Grace Taylor', hireDate: new Date('2023-06-05'), salary: 71000.00 },
    { name: 'Henry Clark', hireDate: new Date('2023-04-18'), salary: 67000.00 }
  ];

  for (let i = 0; i < employees.length; i++) {
    await prisma.employee.upsert({
      where: { id: i + 3 }, // Start from ID 3
      update: {},
      create: {
        name: employees[i].name,
        hireDate: employees[i].hireDate,
        salary: employees[i].salary,
      },
    });
  }

  // Create requests using upsert to prevent duplicates
  const requests = [
    { id: 1, code: 'REQ-001', summary: 'Vacation Request', description: 'Requesting time off for vacation from Dec 20-24', employeeId: employee1.id },
    { id: 2, code: 'REQ-002', summary: 'Equipment Request', description: 'Need new laptop and monitor for development work', employeeId: employee2.id },
    { id: 3, code: 'REQ-003', summary: 'Training Request', description: 'Request for React training course', employeeId: 3 },
    { id: 4, code: 'REQ-004', summary: 'Sick Leave', description: 'Medical leave for 3 days', employeeId: 4 },
    { id: 5, code: 'REQ-005', summary: 'Office Supplies', description: 'Need new desk chair and keyboard', employeeId: 5 },
    { id: 6, code: 'REQ-006', summary: 'Remote Work', description: 'Request to work from home 2 days per week', employeeId: 6 }
  ];

  for (const request of requests) {
    await prisma.request.upsert({
      where: { id: request.id },
      update: {},
      create: {
        code: request.code,
        summary: request.summary,
        description: request.description,
        employeeId: request.employeeId,
      },
    });
  }

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