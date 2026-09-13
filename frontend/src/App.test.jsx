import { TripProvider } from './context/TripContext';
/* global global */
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';

// Mock the fetch API
global.fetch = vi.fn();

const mockDestinations = [
  { id: 1, city: "Paris", country: "França", price: 4500, rating: 4.8, category: "Cidade", image: "img1", description: "Desc", amenities: ["Wi-Fi"] },
  { id: 2, city: "Rio", country: "Brasil", price: 1800, rating: 4.7, category: "Praia", image: "img2", description: "Desc", amenities: ["Piscina"] }
];

describe('App', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    sessionStorage.clear();
    // Default fetch success response
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockDestinations),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the initial layout with loading state and then destinations', async () => {

    render(
      <TripProvider>
        <App />
      </TripProvider>
    );

    // Check Navbar
    expect(screen.getByText('Trip')).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Paris')).toBeInTheDocument();
      expect(screen.getByText('Rio')).toBeInTheDocument();
    });
  });

  it('handles tab switching correctly', async () => {

    render(
      <TripProvider>
        <App />
      </TripProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Paris')).toBeInTheDocument();
    });

    // We can't rely solely on .toBeVisible() because JSDOM doesn't load external CSS (like Tailwind's .hidden).
    // So we check the actual className for the tabs to ensure the correct visibility classes are applied.

    // Switch to Minhas Viagens
    fireEvent.click(screen.getByRole('button', { name: 'Minhas Viagens' }));

    // Check that 'Minhas Viagens' tab is visible and 'home' tab is hidden
    const minhasViagensTab = screen.getByText('Nenhuma viagem agendada.').closest('div.max-w-4xl');
    expect(minhasViagensTab).toHaveClass('block');

    const homeTab = screen.getByText('Para onde você quer ir?').closest('div.pt-16 > div');
    expect(homeTab).toHaveClass('hidden');

    // Switch to Favoritos
    fireEvent.click(screen.getByRole('button', { name: 'Favoritos' }));

    // Check that 'Favoritos' tab is visible and 'Minhas Viagens' is hidden
    const favoritosTab = screen.getByText('Nenhum favorito ainda.').closest('div.max-w-7xl');
    expect(favoritosTab).toHaveClass('block');
    expect(minhasViagensTab).toHaveClass('hidden');

    // Switch back to Explorar (home)
    fireEvent.click(screen.getByRole('button', { name: 'Explorar' }));

    expect(homeTab).toHaveClass('block');
    expect(favoritosTab).toHaveClass('hidden');
  });

  it('handles search correctly', async () => {

    render(
      <TripProvider>
        <App />
      </TripProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Paris')).toBeInTheDocument();
    });

    // We can simulate search by finding the search button if we can target it.
    // Assuming SearchBar has a button
    const searchInput = screen.getByPlaceholderText('Busque por cidade (Ex: Dubai, Londres, Singapura...)');

    // Setup fetch mock for search response
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([mockDestinations[0]]) // Only Paris
    });

    fireEvent.change(searchInput, { target: { value: 'Paris' } });
    const searchButton = screen.getByRole('button', { name: /buscar/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/trips/search?query=Paris',
        expect.any(Object)
      );
    });
  });

  it('handles category filtering', async () => {

    render(
      <TripProvider>
        <App />
      </TripProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Paris')).toBeInTheDocument(); // Cidade
      expect(screen.getByText('Rio')).toBeInTheDocument(); // Praia
    });

    // Click Praia category
    fireEvent.click(screen.getByText('Praia'));

    // Paris should be gone, Rio should stay
    expect(screen.queryByText('Paris')).not.toBeInTheDocument();
    expect(screen.getByText('Rio')).toBeInTheDocument();
  });

  it('can open login modal', async () => {

    render(
      <TripProvider>
        <App />
      </TripProvider>
    );

    fireEvent.click(screen.getByText('Entrar'));

    // AuthForm should be visible (Acesse sua conta is modal title)
    await waitFor(() => {
      expect(screen.getByText('Acesse sua conta')).toBeInTheDocument();
    });
  });

  it('handles API failure gracefully using mock fallback', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API failed'));


    render(
      <TripProvider>
        <App />
      </TripProvider>
    );

    // It should load the fallback mockDestinations which includes Paris
    await waitFor(() => {
      expect(screen.getByText('Paris')).toBeInTheDocument();
    });
  });

  it('silently ignores AbortError without updating state or logging', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const abortError = new Error('Request aborted');
    abortError.name = 'AbortError';
    global.fetch.mockRejectedValueOnce(abortError);

    await act(async () => {
      render(
        <TripProvider>
          <App />
        </TripProvider>
      );
    });

    // Should not render the fallback data
    expect(screen.queryByText('Paris')).not.toBeInTheDocument();
    expect(screen.queryByText('Rio')).not.toBeInTheDocument();

    // Should not log the error
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
