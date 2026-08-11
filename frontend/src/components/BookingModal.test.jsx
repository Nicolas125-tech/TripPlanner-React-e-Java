import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BookingModal from './BookingModal';

describe('BookingModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <BookingModal isOpen={false} onClose={() => {}} onConfirm={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders form elements correctly when isOpen is true', () => {
    render(<BookingModal isOpen={true} onClose={() => {}} onConfirm={() => {}} />);

    expect(screen.getByText('Confirmar Reserva')).toBeInTheDocument();
    expect(screen.getByLabelText(/Ida/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Volta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hóspedes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirmar Pagamento/i })).toBeInTheDocument();
  });

  it('calls onConfirm with form data when submitted', () => {
    const onConfirm = vi.fn();
    render(<BookingModal isOpen={true} onClose={() => {}} onConfirm={onConfirm} />);

    const dateStartInput = screen.getByLabelText(/Ida/i);
    const dateEndInput = screen.getByLabelText(/Volta/i);
    const guestsInput = screen.getByLabelText(/Hóspedes/i);
    const submitButton = screen.getByRole('button', { name: /Confirmar Pagamento/i });

    fireEvent.change(dateStartInput, { target: { value: '2023-10-15' } });
    fireEvent.change(dateEndInput, { target: { value: '2023-10-20' } });
    fireEvent.change(guestsInput, { target: { value: '2' } });

    fireEvent.click(submitButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledWith({
      dateStart: '2023-10-15',
      dateEnd: '2023-10-20',
      guests: 2
    });
  });

  it('updates state variables when inputs change', () => {
    render(<BookingModal isOpen={true} onClose={() => {}} onConfirm={() => {}} />);

    const dateStartInput = screen.getByLabelText(/Ida/i);
    const dateEndInput = screen.getByLabelText(/Volta/i);
    const guestsInput = screen.getByLabelText(/Hóspedes/i);

    fireEvent.change(dateStartInput, { target: { value: '2023-12-01' } });
    expect(dateStartInput.value).toBe('2023-12-01');

    fireEvent.change(dateEndInput, { target: { value: '2023-12-10' } });
    expect(dateEndInput.value).toBe('2023-12-10');

    fireEvent.change(guestsInput, { target: { value: '4' } });
    expect(guestsInput.value).toBe('4');
  });
});
