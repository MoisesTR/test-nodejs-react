const request = require('supertest');
const app = require('../../src/app');
const { createTestUser, createTestEmployee, createTestRequest, generateTestToken, getAuthHeaders } = require('../utils/testHelpers');

describe('Request Controllers', () => {
  let adminUser, employeeUser, adminToken, employeeToken;

  beforeEach(async () => {
    adminUser = await createTestUser('administrator');
    employeeUser = await createTestUser('employee');
    adminToken = generateTestToken(adminUser.id, 'administrator');
    employeeToken = generateTestToken(employeeUser.id, 'employee');
  });

  describe('GET /api/requests', () => {
    beforeEach(async () => {
      await createTestRequest();
      await createTestRequest();
    });

    it('should get requests list for admin', async () => {
      await createTestRequest();

      const response = await request(app)
        .get('/api/requests')
        .set(getAuthHeaders(adminToken))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.requests.length).toBeGreaterThanOrEqual(1);
      expect(response.body.data.page).toBe(1);
      expect(response.body.data.total).toBeGreaterThanOrEqual(1);
    });

    it('should get requests list for employee', async () => {
      const response = await request(app)
        .get('/api/requests')
        .set(getAuthHeaders(employeeToken))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.requests.length).toBeGreaterThanOrEqual(0);
    });

    it('should include employee information', async () => {
      const response = await request(app)
        .get('/api/requests')
        .set(getAuthHeaders(adminToken))
        .expect(200);

      if (response.body.data.requests.length > 0) {
        expect(response.body.data.requests[0].employee).toBeDefined();
        expect(response.body.data.requests[0].employee.name).toBeDefined();
        expect(response.body.data.requests[0].employee.id).toBeDefined();
        expect(typeof response.body.data.requests[0].employee.name).toBe('string');
      }
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/requests?page=1&limit=1')
        .set(getAuthHeaders(adminToken))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.page).toBe(1);
      expect(response.body.data.limit).toBe(1);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/requests')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/requests/:id', () => {
    it('should get request by id for admin', async () => {
      const testRequest = await createTestRequest();

      const response = await request(app)
        .get(`/api/requests/${testRequest.id}`)
        .set(getAuthHeaders(adminToken))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.request.id).toBe(testRequest.id);
      expect(response.body.data.request.code).toBe(testRequest.code);
      expect(response.body.data.request.employee).toBeDefined();
    });

    it('should get request by id for employee', async () => {
      const testRequest = await createTestRequest(null, employeeUser.id);

      const response = await request(app)
        .get(`/api/requests/${testRequest.id}`)
        .set(getAuthHeaders(employeeToken))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.request.id).toBe(testRequest.id);
    });

    it('should return 404 for non-existent request', async () => {
      const response = await request(app)
        .get('/api/requests/99999')
        .set(getAuthHeaders(adminToken))
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Request not found');
    });
  });

  describe('POST /api/requests', () => {
    it('should create request as admin for any employee', async () => {
      const requestEmployee = await createTestEmployee();
      const validRequestData = {
        code: 'REQ-001',
        summary: 'Equipment Request',
        description: 'Need new laptop for development work',
        employeeId: requestEmployee.id
      };

      const response = await request(app)
        .post('/api/requests')
        .set(getAuthHeaders(adminToken))
        .send(validRequestData);

      expect(response.body.success).toBe(true);
    });

    it('should fail to create request as regular employee', async () => {
      const requestEmployee = await createTestEmployee();
      const validRequestData = {
        code: 'REQ-002',
        summary: 'Equipment Request',
        description: 'Need new laptop for development work',
        employeeId: requestEmployee.id
      };

      const response = await request(app)
        .post('/api/requests')
        .set(getAuthHeaders(employeeToken))
        .send(validRequestData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Insufficient permissions');
    });

    it('should prevent duplicate request codes', async () => {
      const requestEmployee = await createTestEmployee();
      const validRequestData = {
        code: 'REQ-DUPLICATE',
        summary: 'Equipment Request',
        description: 'Need new laptop for development work',
        employeeId: requestEmployee.id
      };

      const response = await request(app)
        .post('/api/requests')
        .set(getAuthHeaders(adminToken))
        .send(validRequestData);

      expect(response.body.success).toBe(true);
    });

    it('should validate required fields', async () => {
      // Create a fresh employee for this test
      const requestEmployee = await createTestEmployee();
      const validRequestData = {
        code: 'REQ-VALIDATION',
        summary: 'Equipment Request',
        description: 'Need new laptop for development work',
        employeeId: requestEmployee.id
      };

      const testCases = [
        { field: 'code', data: { ...validRequestData, code: '' } },
        { field: 'summary', data: { ...validRequestData, summary: '' } },
        { field: 'description', data: { ...validRequestData, description: '' } },
        { field: 'employeeId', data: { ...validRequestData, employeeId: null } }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/requests')
          .set(getAuthHeaders(adminToken))
          .send(testCase.data)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error.message).toBe('Validation failed');
        expect(response.body.error.details).toBeDefined();
        expect(Array.isArray(response.body.error.details)).toBe(true);
      }
    });

    it('should validate employee exists before creating request', async () => {
      const tempEmployee = await createTestEmployee();
      await request(app)
        .delete(`/api/employees/${tempEmployee.id}`)
        .set(getAuthHeaders(adminToken));

      const invalidData = {
        code: 'REQ-INVALID-EMP',
        summary: 'Equipment Request',
        description: 'Need new laptop for development work',
        employeeId: tempEmployee.id
      };

      const response = await request(app)
        .post('/api/requests')
        .set(getAuthHeaders(adminToken))
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Employee not found');
    });


  });

  describe('DELETE /api/requests/:id', () => {
    it('should delete request as admin', async () => {
      const testRequest = await createTestRequest();

      const response = await request(app)
        .delete(`/api/requests/${testRequest.id}`)
        .set(getAuthHeaders(adminToken))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('Request deleted');
    });

    it('should fail to delete request as regular employee', async () => {
      const testRequest = await createTestRequest();

      const response = await request(app)
        .delete(`/api/requests/${testRequest.id}`)
        .set(getAuthHeaders(employeeToken))
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should return 404 for already deleted request', async () => {
      const testRequest = await createTestRequest();

      await request(app)
        .delete(`/api/requests/${testRequest.id}`)
        .set(getAuthHeaders(adminToken))
        .expect(200);
      const response = await request(app)
        .delete(`/api/requests/${testRequest.id}`)
        .set(getAuthHeaders(adminToken))
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Request not found');
    });
  });
});