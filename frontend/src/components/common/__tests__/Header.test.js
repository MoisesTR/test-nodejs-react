import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../Header';

// Mock the entire AuthContext
jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { username: 'testuser', role: 'employee' },
    logout: jest.fn()
  })
}));

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('Header Component', () => {
  it('renders the header with logo', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('EmployeeHub')).toBeInTheDocument();
  });

  it('displays user information when logged in', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText(/testuser/)).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});