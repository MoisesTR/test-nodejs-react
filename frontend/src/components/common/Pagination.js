import React from 'react';
import './Pagination.css';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination) {
    return null;
  }

  // Show pagination info even with single page for debugging
  if (pagination.totalPages <= 1) {
    return (
      <div className="pagination">
        <span className="pagination-info">
          Showing {pagination.total} item{pagination.total !== 1 ? 's' : ''}
        </span>
      </div>
    );
  }

  const { page, totalPages, hasNext, hasPrev } = pagination;

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrev}
      >
        Previous
      </button>

      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>

      <button
        className="pagination-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;