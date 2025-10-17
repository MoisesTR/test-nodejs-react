# Employee Management System

Full-stack app with Node.js, React, and PostgreSQL. JWT auth, role-based access, employee/request management.

## Quick Start

```bash
git clone https://github.com/MoisesTR/test-nodejs-react
cd test-nodejs-react
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Test Users

```
Admin: admin@company.com / admin123
Employee: john.doe@company.com / employee123
```

## Tech Stack

- **Backend**: Node.js, Express, Prisma, PostgreSQL
- **Frontend**: React, Context API
- **Auth**: JWT with bcrypt
- **Testing**: Jest, React Testing Library

## Key Features

- JWT authentication with Admin/Employee roles
- Employee CRUD with pagination
- Request management system
- Rate limiting (10 login attempts per 15 min)
- Input validation and SQL injection protection
- Automated tests for backend and frontend

## API Endpoints

```
POST /api/auth/login
POST /api/auth/register
GET  /api/employees
POST /api/employees
GET  /api/requests
POST /api/requests
```

## Environment Setup

### Backend (.env)
```env
DATABASE_URL="postgresql://admin:password@localhost:5432/employee_management"
TEST_DATABASE_URL="postgresql://admin:password@localhost:5432/employee_management_test"
JWT_SECRET="dev-secret-key"
JWT_EXPIRES_IN="24h"
PORT=3001
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development
```

## Running Tests

```bash
# Backend
cd backend && npm test

# Frontend  
cd frontend && npm test
```

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   ├── prisma/
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── services/
└── docker-compose.yml
```

## Security Features

- **Authentication**: JWT tokens with 24h expiration
- **Password Security**: bcrypt with 12 salt rounds  
- **Rate Limiting**: 10 login attempts per 15 minutes (brute force protection)
- **Input Validation**: Express-validator on all endpoints
- **SQL Protection**: Prisma ORM with prepared statements

## Why These Choices?

- **Prisma**: Type-safe database access, rapid prototyping, automatic migrations
- **JWT**: Stateless auth, scalable for distributed systems
- **Docker**: Consistent development environment, easy deployment
- **React Context**: Simple state management, no external dependencies needed

## Screenshots

### Login & Requests
![Login](docs/screenshots/login.png) ![Requests](docs/screenshots/admin-requests.png)

### Admin -> Employee Management
![Employee List](docs/screenshots/admin-employees.png) ![Employee Form](docs/screenshots/employee-form.png)

## Best Practices Summary

**Security**: JWT + bcrypt + rate limiting prevents common attacks  
**Database**: Prisma migrations ensure schema consistency across environments  
**Testing**: Separate test DB prevents data corruption during development  
**Architecture**: Controller-Route-Middleware separation for maintainability  
**Docker**: Eliminates "works on my machine" deployment issues

---

Built with Node.js, React, and PostgreSQL