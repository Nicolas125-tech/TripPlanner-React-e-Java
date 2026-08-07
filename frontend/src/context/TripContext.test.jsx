import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TripProvider, useTrips } from './TripContext';

// Dummy component to test context
const TestComponent = () => {
  const {
    user,
    login,
    logout,
    favorites,
    toggleFavorite,
    myTrips,
    bookTrip,
    destinations,
    loading,
    error,
    searchDestinations
  } = useTrips();

  return (
    <div>
      <div data-testid="user">{user ? user.name : 'no-user'}</div>
      <div data-testid="favorites">{favorites.join(',')}</div>
      <div data-testid="trips-count">{myTrips.length}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'no-error'}</div>
      <div data-testid="destinations-count">{destinations.length}</div>

      <button onClick={() => login('John', 'john@example.com')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
      <button onClick={() => toggleFavorite(1)}>Toggle Fav 1</button>
      <button onClick={() => bookTrip({ id: 10, price: 100 }, { guests: 2, date: '2023-10-10' })}>Book Trip</button>
      <button onClick={() => searchDestinations('Paris')}>Search</button>
    </div>
  );
};

describe('TripContext', () => {
  let localStorageMock;

  beforeEach(() => {
    localStorageMock = (() => {
      let store = {};
      return {
        getItem: vi.fn(key => store[key] || null),
        setItem: vi.fn((key, value) => {
          store[key] = value ? value.toString() : 'null';
        }),
        clear: vi.fn(() => {
          store = {};
        })
      };
    })();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    window.localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws error when useTrips is used outside of TripProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const TestComponentOutside = () => {
      useTrips();
      return null;
    };

    expect(() => render(<TestComponentOutside />)).toThrow('useTrips deve ser usado dentro de TripProvider');

    consoleSpy.mockRestore();
  });

  it('initializes with default empty values when localStorage is empty', () => {
    render(
      <TripProvider>
        <TestComponent />
      </TripProvider>
    );

    expect(screen.getByTestId('user').textContent).toBe('no-user');
    expect(screen.getByTestId('favorites').textContent).toBe('');
    expect(screen.getByTestId('trips-count').textContent).toBe('0');
  });

  it('initializes with values from localStorage', () => {
    window.localStorage.setItem('trip_user', JSON.stringify({ name: 'Alice', email: 'alice@test.com' }));
    window.localStorage.setItem('trip_favorites', JSON.stringify([1, 2]));
    window.localStorage.setItem('trip_bookings', JSON.stringify([{ id: 1 }]));

    render(
      <TripProvider>
        <TestComponent />
      </TripProvider>
    );

    expect(screen.getByTestId('user').textContent).toBe('Alice');
    expect(screen.getByTestId('favorites').textContent).toBe('1,2');
    expect(screen.getByTestId('trips-count').textContent).toBe('1');
  });

  it('login updates user state and localStorage', () => {
    render(
      <TripProvider>
        <TestComponent />
      </TripProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    expect(screen.getByTestId('user').textContent).toBe('John');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('trip_user', expect.stringContaining('John'));
  });

  it('logout clears user state and updates localStorage', () => {
    window.localStorage.setItem('trip_user', JSON.stringify({ name: 'Alice' }));

    render(
      <TripProvider>
        <TestComponent />
      </TripProvider>
    );

    expect(screen.getByTestId('user').textContent).toBe('Alice');

    fireEvent.click(screen.getByText('Logout'));

    expect(screen.getByTestId('user').textContent).toBe('no-user');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('trip_user', 'null');
  });

  it('toggleFavorite adds and removes favorite ID and updates localStorage', () => {
    render(
      <TripProvider>
        <TestComponent />
      </TripProvider>
    );

    // Add favorite
    fireEvent.click(screen.getByText('Toggle Fav 1'));
    expect(screen.getByTestId('favorites').textContent).toBe('1');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('trip_favorites', JSON.stringify([1]));

    // Remove favorite
    fireEvent.click(screen.getByText('Toggle Fav 1'));
    expect(screen.getByTestId('favorites').textContent).toBe('');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('trip_favorites', JSON.stringify([]));
  });

  it('bookTrip adds a booking with total price and status and updates localStorage', () => {
    render(
      <TripProvider>
        <TestComponent />
      </TripProvider>
    );

    fireEvent.click(screen.getByText('Book Trip'));

    expect(screen.getByTestId('trips-count').textContent).toBe('1');

    const calls = window.localStorage.setItem.mock.calls;
    const bookingCall = calls.find(call => call[0] === 'trip_bookings');
    expect(bookingCall).toBeDefined();

    const savedTrips = JSON.parse(bookingCall[1]);
    expect(savedTrips).toHaveLength(1);
    expect(savedTrips[0].id).toBe(10);
    expect(savedTrips[0].guests).toBe(2);
    expect(savedTrips[0].totalPrice).toBe(200);
    expect(savedTrips[0].status).toBe('Confirmado');
    expect(savedTrips[0].bookingId).toBeDefined();
  });

  it('searchDestinations fetches data and updates state', async () => {
    const mockData = [{ id: 1, name: 'Paris' }, { id: 2, name: 'Lyon' }];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData)
      })
    );

    render(
      <TripProvider>
        <TestComponent />
      </TripProvider>
    );

    expect(screen.getByTestId('destinations-count').textContent).toBe('0');

    await act(async () => {
      fireEvent.click(screen.getByText('Search'));
    });

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/trips/search?query=Paris');
    expect(screen.getByTestId('destinations-count').textContent).toBe('2');
    expect(screen.getByTestId('loading').textContent).toBe('false');
    expect(screen.getByTestId('error').textContent).toBe('no-error');
  });

  it('searchDestinations handles errors correctly', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false
      })
    );

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <TripProvider>
        <TestComponent />
      </TripProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Search'));
    });

    expect(screen.getByTestId('error').textContent).toBe('Erro ao buscar destinos');
    expect(screen.getByTestId('loading').textContent).toBe('false');

    consoleSpy.mockRestore();
  });
});
