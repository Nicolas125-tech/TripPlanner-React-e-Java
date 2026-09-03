import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CategoryPill from './CategoryPill';

describe('CategoryPill Component', () => {
  it('renders the label and icon', () => {
    const mockOnClick = vi.fn();
    render(<CategoryPill icon={<span data-testid="icon">Icon</span>} label="Mountain" active={false} onClick={mockOnClick} />);

    expect(screen.getByText('Mountain')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('applies the active classes when active is true', () => {
    const mockOnClick = vi.fn();
    const { container } = render(<CategoryPill icon={<span>Icon</span>} label="Beach" active={true} onClick={mockOnClick} />);

    const button = container.firstChild;
    expect(button).toHaveClass('bg-blue-600', 'text-white', 'border-blue-600');
  });

  it('applies the inactive classes when active is false', () => {
    const mockOnClick = vi.fn();
    const { container } = render(<CategoryPill icon={<span>Icon</span>} label="City" active={false} onClick={mockOnClick} />);

    const button = container.firstChild;
    expect(button).toHaveClass('bg-white', 'text-gray-600', 'border-gray-200');
  });

  it('calls onClick with the label when clicked', () => {
    const mockOnClick = vi.fn();
    render(<CategoryPill icon={<span>Icon</span>} label="Nature" active={false} onClick={mockOnClick} />);

    const button = screen.getByText('Nature').closest('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith('Nature');
  });

  it('has type="button" attribute', () => {
    const mockOnClick = vi.fn();
    render(<CategoryPill icon={<span>Icon</span>} label="Nature" active={false} onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: 'IconNature' });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('has aria-pressed="true" when active', () => {
    const mockOnClick = vi.fn();
    render(<CategoryPill icon={<span>Icon</span>} label="Nature" active={true} onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: 'IconNature' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('has aria-pressed="false" when not active', () => {
    const mockOnClick = vi.fn();
    render(<CategoryPill icon={<span>Icon</span>} label="Nature" active={false} onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: 'IconNature' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });
});
