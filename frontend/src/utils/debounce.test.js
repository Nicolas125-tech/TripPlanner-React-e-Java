import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from './debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should delay the function execution', () => {
    const mockFunc = vi.fn();
    const debouncedFunc = debounce(mockFunc, 100);

    debouncedFunc();
    expect(mockFunc).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(mockFunc).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  it('should only execute once if called multiple times within the wait period', () => {
    const mockFunc = vi.fn();
    const debouncedFunc = debounce(mockFunc, 100);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    expect(mockFunc).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  it('should pass the correct arguments to the debounced function', () => {
    const mockFunc = vi.fn();
    const debouncedFunc = debounce(mockFunc, 100);

    debouncedFunc('test', 123);
    vi.advanceTimersByTime(100);

    expect(mockFunc).toHaveBeenCalledWith('test', 123);
  });

  it('should preserve the `this` context', () => {
    const context = {
      value: 42,
      debouncedMethod: debounce(function() {
        this.value += 1;
      }, 100)
    };

    context.debouncedMethod();
    vi.advanceTimersByTime(100);

    expect(context.value).toBe(43);
  });
});
