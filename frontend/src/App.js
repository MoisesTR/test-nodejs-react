import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EmployeeList from './components/employees/EmployeeList';
import './App.css';

const Dashboard = () => (
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



const Requests = () => (
    <div className="page">
        <h2>Requests</h2>
        <p>Handle employee requests and approvals</p>
    </div>
);

function App() {
    return (
        <AuthProvider>
            <div className="App">
                <Header />
                <main className="main-content">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route 
                            path="/" 
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/employees" 
                            element={
                                <ProtectedRoute>
                                    <EmployeeList />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/requests" 
                            element={
                                <ProtectedRoute>
                                    <Requests />
                                </ProtectedRoute>
                            } 
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </AuthProvider>
    );
}

export default App;