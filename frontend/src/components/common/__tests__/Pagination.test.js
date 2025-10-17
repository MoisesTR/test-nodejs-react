import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../Pagination';

describe('Pagination Component', () => {
  it('renders nothing when pagination is not provided', () => {
    const { container } = render(<Pagination />);
    expect(container.firstChild).toBeNull();
  });

  it('shows item count for single page', () => {
    const pagination = {
      page: 1,
      totalPages: 1,
      total: 5,
      hasNext: false,
      hasPrev: false
    };

    render(<Pagination pagination={pagination} onPageChange={jest.fn()} />);
    
    expect(screen.getByText('Showing 5 items')).toBeInTheDocument();
  });

  it('shows item count for single item', () => {
    const pagination = {
      page: 1,
      totalPages: 1,
      total: 1,
      hasNext: false,
      hasPrev: false
    };

    render(<Pagination pagination={pagination} onPageChange={jest.fn()} />);
    
    expect(screen.getByText('Showing 1 item')).toBeInTheDocument();
  });

  it('renders pagination controls for multiple pages', () => {
    const pagination = {
      page: 2,
      totalPages: 5,
      total: 25,
      hasNext: true,
      hasPrev: true
    };

    render(<Pagination pagination={pagination} onPageChange={jest.fn()} />);
    
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls onPageChange when page button is clicked', () => {
    const mockOnPageChange = jest.fn();
    const pagination = {
      page: 2,
      totalPages: 5,
      total: 25,
      hasNext: true,
      hasPrev: true
    };

    render(<Pagination pagination={pagination} onPageChange={mockOnPageChange} />);
    
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when previous button is clicked', () => {
    const mockOnPageChange = jest.fn();
    const pagination = {
      page: 3,
      totalPages: 5,
      total: 25,
      hasNext: true,
      hasPrev: true
    };

    render(<Pagination pagination={pagination} onPageChange={mockOnPageChange} />);
    
    const prevButton = screen.getByText('Previous');
    fireEvent.click(prevButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });
});