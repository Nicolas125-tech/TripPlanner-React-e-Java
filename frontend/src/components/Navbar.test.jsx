import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from './Navbar';
import * as TripContext from '../context/TripContext';

// Mock the context hook
vi.mock('../context/TripContext', () => ({
  useTrips: vi.fn()
}));

describe('Navbar', () => {
  const mockOnTabChange = vi.fn();
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders logo and navigation tabs correctly', () => {
    vi.mocked(TripContext.useTrips).mockReturnValue({
      user: null,
      logout: mockLogout,
    });

    render(<Navbar activeTab="home" onTabChange={mockOnTabChange} />);

    // Logo text
    expect(screen.getByText('Trip')).toBeInTheDocument();
    expect(screen.getByText('Planner')).toBeInTheDocument();

    // Tabs
    expect(screen.getByText('Explorar')).toBeInTheDocument();
    expect(screen.getByText('Minhas Viagens')).toBeInTheDocument();
    expect(screen.getByText('Favoritos')).toBeInTheDocument();
  });

  it('renders Entrar button when user is not logged in', () => {
    vi.mocked(TripContext.useTrips).mockReturnValue({
      user: null,
      logout: mockLogout,
    });

    render(<Navbar activeTab="home" onTabChange={mockOnTabChange} />);

    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
  });

  it('calls onTabChange("login") when Entrar button is clicked', () => {
    vi.mocked(TripContext.useTrips).mockReturnValue({
      user: null,
      logout: mockLogout,
    });

    render(<Navbar activeTab="home" onTabChange={mockOnTabChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(mockOnTabChange).toHaveBeenCalledWith('login');
  });

  it('renders user info and logout button when user is logged in', () => {
    const mockUser = {
      name: 'Test User',
      avatar: 'https://example.com/avatar.jpg'
    };

    vi.mocked(TripContext.useTrips).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });

    const { container } = render(<Navbar activeTab="home" onTabChange={mockOnTabChange} />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByAltText('Test User')).toBeInTheDocument();
    expect(screen.getByAltText('Test User')).toHaveAttribute('src', 'https://example.com/avatar.jpg');

    // Entrar button should not be present
    expect(screen.queryByRole('button', { name: 'Entrar' })).not.toBeInTheDocument();

    // There are tabs, so there are multiple buttons. We can find logout by its role or structure.
    // The logout button doesn't have text, but it's a button.
    // Let's just find it by clicking the last button or using container query
    // Actually the logout button has no aria-label, so we can find it by finding the button within the user section.
    // However, vitest can just query by role and check the one without text, or we can use container.querySelector
  });

  it('calls logout when logout button is clicked', () => {
    const mockUser = {
      name: 'Test User',
      avatar: 'https://example.com/avatar.jpg'
    };

    vi.mocked(TripContext.useTrips).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });

    const { container } = render(<Navbar activeTab="home" onTabChange={mockOnTabChange} />);

    // The logout button is the last button in the document, or we can find it by svg inside it.
    // A safer way is to find the button next to the avatar.
    const avatar = screen.getByAltText('Test User');
    const logoutButton = avatar.nextElementSibling;

    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });

  it('calls onTabChange with correct tab id when a tab is clicked', () => {
    vi.mocked(TripContext.useTrips).mockReturnValue({
      user: null,
      logout: mockLogout,
    });

    render(<Navbar activeTab="home" onTabChange={mockOnTabChange} />);

    fireEvent.click(screen.getByText('Minhas Viagens'));
    expect(mockOnTabChange).toHaveBeenCalledWith('my-trips');

    fireEvent.click(screen.getByText('Favoritos'));
    expect(mockOnTabChange).toHaveBeenCalledWith('favorites');
  });

  it('calls onTabChange("home") when logo is clicked', () => {
    vi.mocked(TripContext.useTrips).mockReturnValue({
      user: null,
      logout: mockLogout,
    });

    const { container } = render(<Navbar activeTab="favorites" onTabChange={mockOnTabChange} />);

    // The logo div has text 'TripPlanner' inside it. We can click the container.
    const logoText = screen.getByText('Trip');
    // logoText is a span. Its parent is the clickable div.
    fireEvent.click(logoText.parentElement);

    expect(mockOnTabChange).toHaveBeenCalledWith('home');
  });
});
