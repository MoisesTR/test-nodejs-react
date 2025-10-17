import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { renderWithAuth, createMockAuthContext, mockAdminUser, mockEmployeeUser, mockApi } from '../test-utils/mockAuthContext';

// Mock all the components that make API calls
jest.mock('../components/employees/EmployeeList', () => {
  return function MockEmployeeList() {
    return <div>Employee List Component</div>;
  };
});

jest.mock('../components/requests/RequestList', () => {
  return function MockRequestList() {
    return <div>Request List Component</div>;
  };
});

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderApp = (authValue) => {
    return render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      {
        wrapper: ({ children }) => renderWithAuth(children, { authValue })
      }
    );
  };

  it('renders login page when user is not authenticated', () => {
    const authValue = createMockAuthContext(null);
    renderApp(authValue);

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders employee list when authenticated user navigates to /employees', async () => {
    const authValue = createMockAuthContext(mockEmployeeUser);

    // Mock the initial route to be /employees
    delete window.location;
    window.location = { pathname: '/employees' };

    renderApp(authValue);

    await waitFor(() => {
      expect(screen.getByText('Employee List Component')).toBeInTheDocument();
    });
  });

  it('renders request list when authenticated user navigates to /requests', async () => {
    const authValue = createMockAuthContext(mockEmployeeUser);

    // Mock the initial route to be /requests
    delete window.location;
    window.location = { pathname: '/requests' };

    renderApp(authValue);

    await waitFor(() => {
      expect(screen.getByText('Request List Component')).toBeInTheDocument();
    });
  });

  it('shows header navigation when user is authenticated', () => {
    const authValue = createMockAuthContext(mockEmployeeUser);
    renderApp(authValue);

    expect(screen.getByText('Employee Management')).toBeInTheDocument();
    expect(screen.getByText('Employees')).toBeInTheDocument();
    expect(screen.getByText('Requests')).toBeInTheDocument();
    expect(screen.getByText(`Welcome, ${mockEmployeeUser.username}`)).toBeInTheDocument();
  });

  it('does not show navigation when user is not authenticated', () => {
    const authValue = createMockAuthContext(null);
    renderApp(authValue);

    expect(screen.getByText('Employee Management')).toBeInTheDocument();
    expect(screen.queryByText('Employees')).not.toBeInTheDocument();
    expect(screen.queryByText('Requests')).not.toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('handles logout flow correctly', async () => {
    const authValue = createMockAuthContext(mockEmployeeUser);
    renderApp(authValue);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(authValue.logout).toHaveBeenCalled();
  });

  it('shows loading state appropriately', () => {
    const authValue = createMockAuthContext(null, true); // loading = true
    renderApp(authValue);

    // Should not show login form while loading
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
  });

  it('redirects unauthenticated users from protected routes', async () => {
    const authValue = createMockAuthContext(null);

    // Try to access protected route
    delete window.location;
    window.location = { pathname: '/employees' };

    renderApp(authValue);

    // Should redirect to login
    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument();
    });
  });
});