import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  // Fake timers: the test moves the clock forward itself, so it doesn't wait 300ms for real and
  // doesn't depend on how fast the machine is
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the first value straight away', () => {
    const { result } = renderHook(() => useDebounce('iphone'));

    expect(result.current).toBe('iphone');
  });

  it('returns a new value only after 300ms without changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: '' },
    });

    rerender({ value: 'iphone' });
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe('');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('iphone');
  });

  // Typing restarts the wait on every key, so only what the user wrote last comes out
  it('restarts the wait when the value changes again', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: '' },
    });

    rerender({ value: 'i' });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    rerender({ value: 'ip' });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('ip');
  });
});
