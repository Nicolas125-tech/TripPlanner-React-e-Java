import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  const defaultProps = {
    activeTab: 'home',
    setActiveTab: vi.fn(),
    user: null,
    handleLogout: vi.fn(),
    openAuthModal: vi.fn(),
  };

  it('renders correctly with no user', () => {
    render(<Navbar {...defaultProps} />);

    // Check brand
    expect(screen.getByText('Trip')).toBeInTheDocument();
    expect(screen.getByText('Planner')).toBeInTheDocument();

    // Check tabs
    expect(screen.getByText('Explorar')).toBeInTheDocument();
    expect(screen.getByText('Minhas Viagens')).toBeInTheDocument();
    expect(screen.getByText('Favoritos')).toBeInTheDocument();

    // Check login button
    const loginButton = screen.getByRole('button', { name: /entrar/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('renders correctly with a user', () => {
    const user = { name: 'John Doe', avatar: 'avatar.jpg' };
    render(<Navbar {...defaultProps} user={user} />);

    // Check user info
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    const avatar = screen.getByAltText("John Doe's avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'avatar.jpg');

    // Login button should not be present
    expect(screen.queryByRole('button', { name: /entrar/i })).not.toBeInTheDocument();
  });

  it('calls setActiveTab when a tab is clicked', () => {
    render(<Navbar {...defaultProps} />);

    fireEvent.click(screen.getByText('Minhas Viagens'));
    expect(defaultProps.setActiveTab).toHaveBeenCalledWith('my-trips');

    fireEvent.click(screen.getByText('Favoritos'));
    expect(defaultProps.setActiveTab).toHaveBeenCalledWith('favorites');
  });

  it('calls setActiveTab when the brand logo is clicked', () => {
    const { container } = render(<Navbar {...defaultProps} />);

    // The brand logo container has cursor-pointer and onClick
    const brandContainer = screen.getByText('Trip').closest('.cursor-pointer');
    fireEvent.click(brandContainer);

    expect(defaultProps.setActiveTab).toHaveBeenCalledWith('home');
  });

  it('calls openAuthModal when Entrar button is clicked', () => {
    render(<Navbar {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(defaultProps.openAuthModal).toHaveBeenCalled();
  });

  it('calls handleLogout when user avatar is clicked', () => {
    const user = { name: 'Jane Doe', avatar: 'avatar.jpg' };
    render(<Navbar {...defaultProps} user={user} />);

    fireEvent.click(screen.getByAltText("Jane Doe's avatar"));
    expect(defaultProps.handleLogout).toHaveBeenCalled();
  });
});
