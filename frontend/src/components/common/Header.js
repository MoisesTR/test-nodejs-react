import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h2>EMS</h2>
        </Link>

        <nav className="nav-links">
          {user ? (
            <>
              <Link to="/">Dashboard</Link>
              <Link to="/employees">Employees</Link>
              <Link to="/requests">Requests</Link>
              
              <div className="user-menu">
                <span className="user-info">
                  {user.username} ({user.role})
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;