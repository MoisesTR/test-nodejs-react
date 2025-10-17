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

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrev}
      >
        Previous
      </button>

      {getPageNumbers().map(pageNum => (
        <button
          key={pageNum}
          className={`pagination-btn ${pageNum === page ? 'active' : ''}`}
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </button>
      ))}

      <button
        className="pagination-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
      >
        Next
      </button>

      <span className="pagination-info">
        Page {page} of {totalPages} ({pagination.total} total items)
      </span>
    </div>
  );
};

export default Pagination;