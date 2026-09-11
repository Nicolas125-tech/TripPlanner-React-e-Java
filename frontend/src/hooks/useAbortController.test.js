import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAbortController } from './useAbortController';

describe('useAbortController hook', () => {
  it('should initialize and return new controller', () => {
    const { result } = renderHook(() => useAbortController());

    let controller;
    act(() => {
      controller = result.current.getNewController();
    });

    expect(controller).toBeInstanceOf(AbortController);
    expect(result.current.isCurrentController(controller)).toBe(true);
  });

  it('should abort previous controller when getting a new one', () => {
    const { result } = renderHook(() => useAbortController());

    let firstController;
    act(() => {
      firstController = result.current.getNewController();
    });

    const abortSpy = vi.spyOn(firstController, 'abort');

    let secondController;
    act(() => {
      secondController = result.current.getNewController();
    });

    expect(abortSpy).toHaveBeenCalledTimes(1);
    expect(result.current.isCurrentController(firstController)).toBe(false);
    expect(result.current.isCurrentController(secondController)).toBe(true);
  });

  it('should explicitly abort the current controller', () => {
    const { result } = renderHook(() => useAbortController());

    let controller;
    act(() => {
      controller = result.current.getNewController();
    });

    const abortSpy = vi.spyOn(controller, 'abort');

    act(() => {
      result.current.abort();
    });

    expect(abortSpy).toHaveBeenCalledTimes(1);
    expect(result.current.isCurrentController(controller)).toBe(false);
  });

  it('should cleanup on unmount', () => {
    const { result, unmount } = renderHook(() => useAbortController());

    let controller;
    act(() => {
      controller = result.current.getNewController();
    });

    const abortSpy = vi.spyOn(controller, 'abort');

    unmount();

    expect(abortSpy).toHaveBeenCalledTimes(1);
  });
});
