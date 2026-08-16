import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TripCard from './TripCard';

const mockTrip = {
  id: 1,
  city: 'Paris',
  country: 'France',
  price: '5000',
  rating: 4.8,
  imageUrl: 'https://example.com/paris.jpg',
};

describe('TripCard', () => {
  it('renders trip information correctly', () => {
    const onDetailsClick = vi.fn();
    const onFavoriteClick = vi.fn();

    render(
      <TripCard
        trip={mockTrip}
        isFavorite={false}
        onDetailsClick={onDetailsClick}
        onFavoriteClick={onFavoriteClick}
      />
    );

    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('France')).toBeInTheDocument();
    expect(screen.getByText('R$ 5000')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  it('calls onDetailsClick when card is clicked', () => {
    const onDetailsClick = vi.fn();
    const onFavoriteClick = vi.fn();

    const { container } = render(
      <TripCard
        trip={mockTrip}
        isFavorite={false}
        onDetailsClick={onDetailsClick}
        onFavoriteClick={onFavoriteClick}
      />
    );

    // The main container div has the onClick for details
    const card = container.firstChild;
    fireEvent.click(card);

    expect(onDetailsClick).toHaveBeenCalledWith(mockTrip);
    expect(onDetailsClick).toHaveBeenCalledTimes(1);
  });

  it('calls onFavoriteClick when favorite button is clicked', () => {
    const onDetailsClick = vi.fn();
    const onFavoriteClick = vi.fn();

    render(
      <TripCard
        trip={mockTrip}
        isFavorite={false}
        onDetailsClick={onDetailsClick}
        onFavoriteClick={onFavoriteClick}
      />
    );

    const favoriteButton = screen.getByRole('button', { name: 'Adicionar aos favoritos' });
    fireEvent.click(favoriteButton);

    expect(onFavoriteClick).toHaveBeenCalledWith(1, false);
    expect(onFavoriteClick).toHaveBeenCalledTimes(1);
  });

  it('shows correct aria-label when it is a favorite', () => {
    const onDetailsClick = vi.fn();
    const onFavoriteClick = vi.fn();

    render(
      <TripCard
        trip={mockTrip}
        isFavorite={true}
        onDetailsClick={onDetailsClick}
        onFavoriteClick={onFavoriteClick}
      />
    );

    expect(screen.getByRole('button', { name: 'Remover dos favoritos' })).toBeInTheDocument();
  });
});
