import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './EmployeeForm.css';

const EmployeeForm = ({ employee, onEmployeeCreated, onEmployeeUpdated, onCancel }) => {
  const { api } = useAuth();
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    hireDate: employee?.hireDate ? employee.hireDate.split('T')[0] : '',
    salary: employee?.salary || ''
  });

  const isEditing = !!employee;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        name: formData.name,
        hireDate: formData.hireDate || null,
        salary: formData.salary ? parseFloat(formData.salary) : null
      };

      let response;
      if (isEditing) {
        response = await api.put(`/employees/${employee.id}`, submitData);
        onEmployeeUpdated(response.data.data.employee);
      } else {
        response = await api.post('/employees', submitData);
        onEmployeeCreated(response.data.data.employee);

        // Reset form only for create
        setFormData({
          name: '',
          hireDate: '',
          salary: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-form-container">
      <form onSubmit={handleSubmit} className="employee-form">
        <h3>{isEditing ? 'Edit Employee' : 'Add New Employee'}</h3>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="hireDate">Hire Date</label>
          <input
            type="date"
            id="hireDate"
            name="hireDate"
            value={formData.hireDate}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="salary">Salary</label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            min="0"
            step="0.01"
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;