const request = require('supertest');
const app = require('../../src/app');
const { createTestUser, createTestEmployee, generateTestToken, getAuthHeaders } = require('../utils/testHelpers');

describe('Employee Controllers', () => {
  let adminUser, employeeUser, adminToken, employeeToken;

  beforeEach(async () => {
    adminUser = await createTestUser('administrator');
    employeeUser = await createTestUser('employee');
    adminToken = generateTestToken(adminUser.id, 'administrator');
    employeeToken = generateTestToken(employeeUser.id, 'employee');
  });

  describe('GET /api/employees', () => {
    beforeEach(async () => {
      await createTestEmployee();
      await createTestEmployee();
    });

    it('should get employees list for admin', async () => {
      const response = await request(app)
        .get('/api/employees')
        .set(getAuthHeaders(adminToken))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.employees.length).toBeGreaterThanOrEqual(1);
      expect(response.body.data.page).toBe(1);
      expect(response.body.data.total).toBeGreaterThanOrEqual(1);
    });

    it('should get employees list for employee', async () => {
      await createTestEmployee();
      await createTestEmployee();

      const response = await request(app)
        .get('/api/employees')
        .set(getAuthHeaders(employeeToken))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.employees.length).toBeGreaterThanOrEqual(1);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/employees?page=1&limit=1')
        .set(getAuthHeaders(adminToken))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.employees).toHaveLength(1);
      expect(response.body.data.page).toBe(1);
      expect(response.body.data.limit).toBe(1);
      expect(response.body.data.totalPages).toBeGreaterThanOrEqual(2);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/employees')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/employees/:id', () => {
    let employee;

    beforeEach(async () => {
      employee = await createTestEmployee();
    });

    it('should get employee by id for admin', async () => {
      const response = await request(app)
        .get(`/api/employees/${employee.id}`)
        .set(getAuthHeaders(adminToken))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.employee.id).toBe(employee.id);
      expect(response.body.data.employee.name).toBe(employee.name);
    });

    it('should get employee by id for employee', async () => {
      const response = await request(app)
        .get(`/api/employees/${employee.id}`)
        .set(getAuthHeaders(employeeToken))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.employee.id).toBe(employee.id);
    });

    it('should return 404 for non-existent employee', async () => {
      const response = await request(app)
        .get('/api/employees/99999')
        .set(getAuthHeaders(adminToken))
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Employee not found');
    });
  });

  describe('POST /api/employees', () => {
    const validEmployeeData = {
      name: 'New Employee',
      hireDate: '2023-01-01',
      salary: 60000
    };

    it('should create employee as admin', async () => {
      const response = await request(app)
        .post('/api/employees')
        .set(getAuthHeaders(adminToken))
        .send(validEmployeeData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.employee.name).toBe(validEmployeeData.name);
      expect(parseFloat(response.body.data.employee.salary)).toBe(validEmployeeData.salary);
    });

    it('should fail to create employee as regular employee', async () => {
      const response = await request(app)
        .post('/api/employees')
        .set(getAuthHeaders(employeeToken))
        .send(validEmployeeData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Insufficient permissions');
    });

    it('should fail with invalid data', async () => {
      const invalidData = {
        name: '', // Empty name
        salary: 'invalid' // Invalid salary
      };

      const response = await request(app)
        .post('/api/employees')
        .set(getAuthHeaders(adminToken))
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.details).toBeDefined();
    });
  });

  describe('PUT /api/employees/:id', () => {
    let employee;
    const updateData = {
      name: 'Updated Employee',
      salary: 70000
    };

    beforeEach(async () => {
      employee = await createTestEmployee();
    });

    it('should update employee as admin', async () => {
      const response = await request(app)
        .put(`/api/employees/${employee.id}`)
        .set(getAuthHeaders(adminToken))
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.employee.name).toBe(updateData.name);
      expect(parseFloat(response.body.data.employee.salary)).toBe(updateData.salary);
    });

    it('should fail to update employee as regular employee', async () => {
      const response = await request(app)
        .put(`/api/employees/${employee.id}`)
        .set(getAuthHeaders(employeeToken))
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/employees/:id', () => {
    let employee;

    beforeEach(async () => {
      employee = await createTestEmployee();
    });

    it('should delete employee as admin', async () => {
      const response = await request(app)
        .delete(`/api/employees/${employee.id}`)
        .set(getAuthHeaders(adminToken))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('Employee deleted');
    });

    it('should fail to delete employee as regular employee', async () => {
      const response = await request(app)
        .delete(`/api/employees/${employee.id}`)
        .set(getAuthHeaders(employeeToken))
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});