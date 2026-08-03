import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default text', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    const customText = 'Please wait...';
    render(<LoadingSpinner text={customText} />);
    expect(screen.getByText(customText)).toBeInTheDocument();
  });
});
