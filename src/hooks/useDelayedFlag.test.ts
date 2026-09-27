import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDelayedFlag } from './useDelayedFlag';

// The flag shows the loading bar only on slow loads, so a quick one doesn't make it blink
describe('useDelayedFlag', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function renderFlag(active: boolean) {
    return renderHook((props) => useDelayedFlag(props.active), { initialProps: { active } });
  }

  it('turns on after being active for 300ms', () => {
    const { result } = renderFlag(true);

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe(true);
  });

  it('stays off while not active', () => {
    const { result } = renderFlag(false);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(false);
  });

  it('never turns on when it stops being active before the delay', () => {
    const { result, rerender } = renderFlag(true);

    act(() => {
      vi.advanceTimersByTime(200);
    });
    rerender({ active: false });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(false);
  });

  it('turns off as soon as it stops being active', () => {
    const { result, rerender } = renderFlag(true);
    act(() => {
      vi.advanceTimersByTime(300);
    });

    rerender({ active: false });

    expect(result.current).toBe(false);
  });

  it('waits the whole delay again when it becomes active again', () => {
    const { result, rerender } = renderFlag(true);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    rerender({ active: false });

    rerender({ active: true });
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe(true);
  });
});
