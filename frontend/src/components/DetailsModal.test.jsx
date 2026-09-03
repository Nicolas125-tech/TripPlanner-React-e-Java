import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DetailsModal from './DetailsModal';

describe('DetailsModal', () => {
  const mockDestination = {
    id: 1,
    city: 'Test City',
    description: 'A very nice test city.',
    imageUrl: 'http://example.com/image.jpg',
    amenities: ['Wifi', 'Pool'],
  };

  it('does not render when destination is null', () => {
    const { container } = render(
      <DetailsModal
        isOpen={true}
        onClose={() => {}}
        destination={null}
        user={null}
        onBookingClick={() => {}}
        onAuthClick={() => {}}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders destination details correctly', () => {
    render(
      <DetailsModal
        isOpen={true}
        onClose={() => {}}
        destination={mockDestination}
        user={null}
        onBookingClick={() => {}}
        onAuthClick={() => {}}
      />
    );

    expect(screen.getByText('Test City')).toBeInTheDocument();
    expect(screen.getByText('A very nice test city.')).toBeInTheDocument();
    expect(screen.getByText('Wifi')).toBeInTheDocument();
    expect(screen.getByText('Pool')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reservar agora/i })).toBeInTheDocument();

    const img = screen.getByAltText('Test City');
    expect(img).toHaveAttribute('src', 'http://example.com/image.jpg');
  });

  it('calls onAuthClick and onClose when unauthenticated user clicks Reservar Agora', () => {
    const onAuthClick = vi.fn();
    const onClose = vi.fn();
    const onBookingClick = vi.fn();

    render(
      <DetailsModal
        isOpen={true}
        onClose={onClose}
        destination={mockDestination}
        user={null}
        onBookingClick={onBookingClick}
        onAuthClick={onAuthClick}
      />
    );

    const button = screen.getByRole('button', { name: /reservar agora/i });
    fireEvent.click(button);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onAuthClick).toHaveBeenCalledTimes(1);
    expect(onBookingClick).not.toHaveBeenCalled();
  });

  it('calls onBookingClick and onClose when authenticated user clicks Reservar Agora', () => {
    const onAuthClick = vi.fn();
    const onClose = vi.fn();
    const onBookingClick = vi.fn();
    const mockUser = { id: 1, name: 'John Doe' };

    render(
      <DetailsModal
        isOpen={true}
        onClose={onClose}
        destination={mockDestination}
        user={mockUser}
        onBookingClick={onBookingClick}
        onAuthClick={onAuthClick}
      />
    );

    const button = screen.getByRole('button', { name: /reservar agora/i });
    fireEvent.click(button);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onBookingClick).toHaveBeenCalledTimes(1);
    expect(onAuthClick).not.toHaveBeenCalled();
  });
});
