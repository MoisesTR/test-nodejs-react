import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import EmployeeForm from './EmployeeForm';
import './EmployeeList.css';

const EmployeeList = () => {
    const { user, api } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await api.get('/employees');
            setEmployees(response.data.data.employees);
            setError('');
        } catch (err) {
            setError('Failed to fetch employees');
            console.error('Error fetching employees:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEmployeeCreated = (newEmployee) => {
        setEmployees([newEmployee, ...employees]);
        setShowForm(false);
    };

    const handleEmployeeUpdated = (updatedEmployee) => {
        setEmployees(employees.map(emp => 
            emp.id === updatedEmployee.id ? updatedEmployee : emp
        ));
        setEditingEmployee(null);
    };

    const handleEditEmployee = (employee) => {
        setEditingEmployee(employee);
        setShowForm(false);
    };

    const handleDeleteEmployee = async (employeeId) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) {
            return;
        }

        try {
            await api.delete(`/employees/${employeeId}`);
            setEmployees(employees.filter(emp => emp.id !== employeeId));
        } catch (err) {
            setError('Failed to delete employee');
            console.error('Error deleting employee:', err);
        }
    };

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isAdmin = user?.role === 'administrator';

    if (loading) {
        return <div className="loading">Loading employees...</div>;
    }

    return (
        <div className="employee-list">
            <div className="employee-header">
                <h2>Employees</h2>
                {isAdmin && (
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : 'Add Employee'}
                    </button>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm && (
                <EmployeeForm
                    onEmployeeCreated={handleEmployeeCreated}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {editingEmployee && (
                <EmployeeForm
                    employee={editingEmployee}
                    onEmployeeUpdated={handleEmployeeUpdated}
                    onCancel={() => setEditingEmployee(null)}
                />
            )}

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="employee-grid">
                {filteredEmployees.length === 0 ? (
                    <div className="no-employees">No employees found</div>
                ) : (
                    filteredEmployees.map(employee => (
                        <div key={employee.id} className="employee-card">
                            <div className="employee-info">
                                <h3>{employee.name}</h3>
                                {employee.hireDate && (
                                    <p>Hire Date: {new Date(employee.hireDate).toLocaleDateString()}</p>
                                )}
                                {employee.salary && (
                                    <p>Salary: ${employee.salary.toLocaleString()}</p>
                                )}
                            </div>
                            {isAdmin && (
                                <div className="employee-actions">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleEditEmployee(employee)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteEmployee(employee.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EmployeeList;