import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

const Home = () => (
    <div className="page">
        <h1>Employee Management System</h1>
        <p>Welcome to the Employee Management System</p>
        <div className="features">
            <div className="feature-card">
                <h3>Employee Management</h3>
                <p>Manage employee information and records</p>
            </div>
            <div className="feature-card">
                <h3>Request Management</h3>
                <p>Handle employee requests and approvals</p>
            </div>
            <div className="feature-card">
                <h3>Role-based Access</h3>
                <p>Different permissions for employees and administrators</p>
            </div>
        </div>
    </div>
);

const Login = () => (
    <div className="page">
        <h2>Login</h2>
        <p>Please enter your credentials to access the system</p>
    </div>
);

const Register = () => (
    <div className="page">
        <h2>Register</h2>
        <p>Create a new account to get started</p>
    </div>
);

const Employees = () => (
    <div className="page">
        <h2>Employees</h2>
        <p>View and manage employee information</p>
    </div>
);

const Requests = () => (
    <div className="page">
        <h2>Requests</h2>
        <p>Handle employee requests and approvals</p>
    </div>
);

function App() {
    return (
        <div className="App">
            <nav className="navbar">
                <div className="nav-brand">
                    <h2>EMS</h2>
                </div>
                <div className="nav-links">
                    <a href="/">Home</a>
                    <a href="/employees">Employees</a>
                    <a href="/requests">Requests</a>
                    <a href="/login">Login</a>
                    <a href="/register">Register</a>
                </div>
            </nav>

            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/requests" element={<Requests />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;