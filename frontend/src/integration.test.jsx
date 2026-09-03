import { TripProvider } from './context/TripContext';
/* global global */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';

// Mock the fetch API
global.fetch = vi.fn();

const mockDestinations = [
  { id: 1, city: "Paris", country: "França", price: 4500, rating: 4.8, category: "Cidade", image: "img1", description: "Desc", amenities: ["Wi-Fi"] },
  { id: 2, city: "Rio", country: "Brasil", price: 1800, rating: 4.7, category: "Praia", image: "img2", description: "Desc", amenities: ["Piscina"] }
];

describe('Integration - Booking Flow', () => {
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

  it('completes the full booking flow from login to booking confirmation', async () => {
    render(
      <TripProvider>
        <App />
      </TripProvider>
    );

    // 1. Wait for destinations to load
    await waitFor(() => {
      expect(screen.getByText('Paris')).toBeInTheDocument();
    });

    // 2. Open details modal for Paris
    const parisCardDetailsButton = screen.getAllByText('Ver Detalhes')[0];
    fireEvent.click(parisCardDetailsButton);

    // Wait for Details Modal to open
    await waitFor(() => {
      expect(screen.getByText('Desc')).toBeInTheDocument(); // Description of Paris
    });

    // 3. Try to book without being logged in -> Should open auth modal
    const bookButton = screen.getByText('Reservar Agora');
    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(screen.getByText('Acesse sua conta')).toBeInTheDocument();
    });

    // 4. Fill in login info and submit
    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Auth modal 'Entrar' button inside a form, other one in navbar
    const loginSubmit = screen.getAllByRole('button', { name: 'Entrar' }).find(el => el.closest('form'));
    fireEvent.click(loginSubmit);

    // Wait for login to complete (auth modal closes)
    await waitFor(() => {
      expect(screen.queryByText('Acesse sua conta')).not.toBeInTheDocument();
      // Verify user is logged in
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // 5. Re-open details modal and book (now logged in)
    fireEvent.click(parisCardDetailsButton);

    await waitFor(() => {
      expect(screen.getByText('Reservar Agora')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Reservar Agora'));

    // Wait for Booking Modal
    await waitFor(() => {
      expect(screen.getByText('Confirmar Reserva')).toBeInTheDocument();
    });

    // 6. Fill in booking details
    // Avoid "multiple elements with the text of: /Ida/i" by finding inputs by role or getting specific input
    // The modal uses inputs with id and labels for those ids
    // Let's use getByLabelText but specific to modal
    const dateStartInput = screen.getAllByLabelText(/Ida/i).find(el => el.tagName === 'INPUT');
    const dateEndInput = screen.getAllByLabelText(/Volta/i).find(el => el.tagName === 'INPUT');
    const guestsInput = screen.getAllByLabelText(/Hóspedes/i).find(el => el.tagName === 'INPUT');

    fireEvent.change(dateStartInput, { target: { value: '2023-11-01' } });
    fireEvent.change(dateEndInput, { target: { value: '2023-11-10' } });
    fireEvent.change(guestsInput, { target: { value: '2' } });

    // 7. Confirm booking
    const confirmButton = screen.getByRole('button', { name: /Confirmar Pagamento/i });
    fireEvent.click(confirmButton);

    // Wait for modal to close and success message
    await waitFor(() => {
      expect(screen.queryByText('Confirmar Reserva')).not.toBeInTheDocument();
      expect(screen.getByText(/Viagem reservada com sucesso/i)).toBeInTheDocument();
    });

    // 8. Verify the booking appears in "Minhas Viagens"
    const myTripsTab = screen.getAllByText('Minhas Viagens')[0]; // first one is the tab button
    fireEvent.click(myTripsTab);

    await waitFor(() => {
      // Check that Paris is in "Minhas Viagens"
      expect(screen.getByText('Status: Confirmado')).toBeInTheDocument();
      expect(screen.getByText('Total: R$ 9000')).toBeInTheDocument(); // 4500 * 2 guests
    });
  });
});
