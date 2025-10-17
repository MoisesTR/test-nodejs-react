import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import './App.css';

const EmployeeList = React.lazy(() => import('./components/employees/EmployeeList'));
const RequestList = React.lazy(() => import('./components/requests/RequestList'));

const Dashboard = () => (
    <div className="page">
        <h1>Dashboard</h1>
        <p>Welcome back! Use the navigation above to manage employees and requests.</p>
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
                                    <Suspense fallback={<div className="loading">Loading...</div>}>
                                        <EmployeeList />
                                    </Suspense>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/requests"
                            element={
                                <ProtectedRoute>
                                    <Suspense fallback={<div className="loading">Loading...</div>}>
                                        <RequestList />
                                    </Suspense>
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