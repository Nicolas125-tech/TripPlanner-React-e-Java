import { renderHook } from '@testing-library/react';
import { useDebouncedStorage } from './useDebouncedStorage';
import { secureStorage } from '../utils/secureStorage';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../utils/secureStorage', () => ({
  secureStorage: {
    setItem: vi.fn(),
  },
}));

vi.useFakeTimers();

describe('useDebouncedStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('debounces storage calls', () => {
    const { result } = renderHook(() => useDebouncedStorage('test_key', 300));

    result.current('value1');
    result.current('value2');
    result.current('value3');

    // Shouldn't be called yet
    expect(secureStorage.setItem).not.toHaveBeenCalled();

    // Fast-forward time
    vi.advanceTimersByTime(300);

    // Should only be called once with the last value
    expect(secureStorage.setItem).toHaveBeenCalledTimes(1);
    expect(secureStorage.setItem).toHaveBeenCalledWith('test_key', 'value3');
  });

  it('transforms Set to Array when transformToArray is true', () => {
    const { result } = renderHook(() => useDebouncedStorage('test_key', 300, true));

    const mySet = new Set(['a', 'b']);
    result.current(mySet);

    vi.advanceTimersByTime(300);

    expect(secureStorage.setItem).toHaveBeenCalledTimes(1);
    expect(secureStorage.setItem).toHaveBeenCalledWith('test_key', ['a', 'b']);
  });
});
