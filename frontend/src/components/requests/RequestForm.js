import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './RequestForm.css';

const RequestForm = ({ employees, onRequestCreated, onCancel }) => {
  const { api } = useAuth();
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    summary: '',
    employeeId: ''
  });
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
        code: formData.code,
        description: formData.description,
        summary: formData.summary,
        employeeId: parseInt(formData.employeeId)
      };

      const response = await api.post('/requests', submitData);
      onRequestCreated(response.data.data.request);
      
      // Reset form
      setFormData({
        code: '',
        description: '',
        summary: '',
        employeeId: ''
      });
    } catch (err) {
      if (err.response?.data?.error?.details) {
        const validationErrors = err.response.data.error.details
          .map(detail => detail.msg)
          .join(', ');
        setError(validationErrors);
      } else {
        setError(err.response?.data?.error?.message || 'Failed to create request');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="request-form-container">
      <form onSubmit={handleSubmit} className="request-form">
        <h3>Add New Request</h3>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="code">Code *</label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="e.g., REQ-001"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="summary">Summary *</label>
          <input
            type="text"
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Brief summary of the request"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description of the request"
            rows="4"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="employeeId">Employee *</label>
          <select
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Select an employee</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
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
            {loading ? 'Creating...' : 'Create Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestForm;