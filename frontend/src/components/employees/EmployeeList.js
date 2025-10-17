import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDebounce } from '../../hooks/useDebounce';
import EmployeeForm from './EmployeeForm';
import Pagination from '../common/Pagination';
import './EmployeeList.css';

const EmployeeList = () => {
    const { user, api } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEmployees(currentPage);
    }, [currentPage]);

    const fetchEmployees = async (page = 1) => {
        try {
            setLoading(true);
            const response = await api.get(`/employees?page=${page}&limit=6`);

            const { employees, ...paginationData } = response.data.data;
            setEmployees(employees);
            setPagination(paginationData);
            setError('');
        } catch (err) {
            setError('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleEmployeeCreated = () => {
        setShowForm(false);
        fetchEmployees(currentPage);
    };

    const handleEmployeeUpdated = () => {
        setEditingEmployee(null);
        fetchEmployees(currentPage);
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
            fetchEmployees(currentPage);
        } catch (err) {
            setError('Failed to delete employee');
        }
    };

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Filter employees on the client side for search
    const filteredEmployees = debouncedSearchTerm 
        ? employees.filter(employee =>
            employee.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
        : employees;

    const isAdmin = user?.role === 'administrator';

    if (loading) {
        return <div className="loading">Loading...</div>;
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

            {!debouncedSearchTerm && (
                <Pagination 
                    pagination={pagination} 
                    onPageChange={handlePageChange} 
                />
            )}
        </div>
    );
};

export default EmployeeList;