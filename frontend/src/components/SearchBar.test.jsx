import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders input and search button', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    expect(screen.getByPlaceholderText('Busque por cidade (Ex: Dubai, Londres, Singapura...)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('Busque por cidade (Ex: Dubai, Londres, Singapura...)');
    fireEvent.change(input, { target: { value: 'Paris' } });

    expect(input.value).toBe('Paris');
  });

  it('calls onSearch with input value when search button is clicked', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('Busque por cidade (Ex: Dubai, Londres, Singapura...)');
    fireEvent.change(input, { target: { value: 'Tokyo' } });

    const button = screen.getByRole('button', { name: /buscar/i });
    fireEvent.click(button);

    expect(onSearch).toHaveBeenCalledWith('Tokyo');
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('calls onSearch with input value when Enter key is pressed', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('Busque por cidade (Ex: Dubai, Londres, Singapura...)');
    fireEvent.change(input, { target: { value: 'New York' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(onSearch).toHaveBeenCalledWith('New York');
    expect(onSearch).toHaveBeenCalledTimes(1);
  });
});
