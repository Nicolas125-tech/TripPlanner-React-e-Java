import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MyTripCard from './MyTripCard';

const mockTrip = {
  id: 1,
  city: 'Rio de Janeiro',
  status: 'Confirmed',
  dateStart: '2023-12-01',
  dateEnd: '2023-12-10',
  totalPrice: '1500',
  imageUrl: 'https://example.com/rio.jpg',
};

const mockTripAlternativeImage = {
  ...mockTrip,
  imageUrl: undefined,
  image: 'https://example.com/rio-alt.jpg',
};

describe('MyTripCard', () => {
  it('renders trip information correctly', () => {
    render(<MyTripCard trip={mockTrip} />);

    expect(screen.getByText('Rio de Janeiro')).toBeInTheDocument();
    expect(screen.getByText('Status: Confirmed')).toBeInTheDocument();
    expect(screen.getByText('Ida: 2023-12-01 | Volta: 2023-12-10')).toBeInTheDocument();
    expect(screen.getByText('Total: R$ 1500')).toBeInTheDocument();
  });

  it('renders the trip image correctly with imageUrl', () => {
    render(<MyTripCard trip={mockTrip} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/rio.jpg');
    expect(image).toHaveAttribute('alt', 'Rio de Janeiro');
  });

  it('renders the trip image correctly with fallback image property', () => {
    render(<MyTripCard trip={mockTripAlternativeImage} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/rio-alt.jpg');
    expect(image).toHaveAttribute('alt', 'Rio de Janeiro');
  });
});
