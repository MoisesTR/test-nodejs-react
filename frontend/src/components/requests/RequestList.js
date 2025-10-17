import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDebounce } from '../../hooks/useDebounce';
import RequestForm from './RequestForm';
import Pagination from '../common/Pagination';
import './RequestList.css';

const RequestList = () => {
    const { user, api } = useAuth();
    const [requests, setRequests] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRequests(currentPage);
        fetchEmployees();
    }, [currentPage]);

    const fetchRequests = async (page = 1) => {
        try {
            setLoading(true);
            const response = await api.get(`/requests?page=${page}&limit=6`);
            const { requests, ...paginationData } = response.data.data;
            setRequests(requests);
            setPagination(paginationData);
            setError('');
        } catch (err) {
            setError('Failed to fetch requests');
            console.error('Error fetching requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employees');
            setEmployees(response.data.data.employees);
        } catch (err) {
            console.error('Error fetching employees:', err);
        }
    };

    const handleRequestCreated = () => {
        setShowForm(false);
        fetchRequests(currentPage);
    };

    const handleDeleteRequest = async (requestId) => {
        if (!window.confirm('Are you sure you want to delete this request?')) {
            return;
        }

        try {
            await api.delete(`/requests/${requestId}`);
            // Refresh the current page after deletion
            fetchRequests(currentPage);
        } catch (err) {
            setError('Failed to delete request');
            console.error('Error deleting request:', err);
        }
    };

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Filter requests on the client side for search
    const filteredRequests = debouncedSearchTerm
        ? requests.filter(request =>
            request.code.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            request.summary.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
        : requests;

    const isAdmin = user?.role === 'administrator';

    if (loading) {
        return <div className="loading">Loading requests...</div>;
    }

    return (
        <div className="request-list">
            <div className="request-header">
                <h2>Requests</h2>
                {isAdmin && (
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : 'Add Request'}
                    </button>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm && (
                <RequestForm
                    employees={employees}
                    onRequestCreated={handleRequestCreated}
                    onCancel={() => setShowForm(false)}
                />
            )}

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search requests by code or summary..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="request-grid">
                {filteredRequests.length === 0 ? (
                    <div className="no-requests">No requests found</div>
                ) : (
                    filteredRequests.map(request => (
                        <div key={request.id} className="request-card">
                            <div className="request-info">
                                <h3>{request.code}</h3>
                                <h4>{request.summary}</h4>
                                <p>{request.description}</p>
                                {request.employee && (
                                    <p className="employee-info">
                                        Employee: {request.employee.name}
                                    </p>
                                )}
                                <p className="request-date">
                                    Created: {new Date(request.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            {isAdmin && (
                                <div className="request-actions">
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteRequest(request.id)}
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

export default RequestList;