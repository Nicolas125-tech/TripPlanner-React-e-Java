import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AuthModal from './AuthModal';

describe('AuthModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <AuthModal isOpen={false} onClose={() => {}} onLogin={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders form fields when isOpen is true', () => {
    render(
      <AuthModal isOpen={true} onClose={() => {}} onLogin={() => {}} />
    );

    expect(screen.getByText('Acesse sua conta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('calls onLogin with correct payload when form is submitted', () => {
    const onLogin = vi.fn();
    render(
      <AuthModal isOpen={true} onClose={() => {}} onLogin={onLogin} />
    );

    const nameInput = screen.getByPlaceholderText('Nome');
    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Simulate form submission (e.g. hitting Enter or clicking the button)
    fireEvent.click(submitButton);

    expect(onLogin).toHaveBeenCalledTimes(1);
    expect(onLogin).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: '' // Note: password input is not present in the current AuthModal.jsx implementation.
    });
  });
});
