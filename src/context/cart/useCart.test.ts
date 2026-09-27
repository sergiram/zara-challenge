import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createCartItem } from '../../test/fixtures';
import { CartProvider } from './CartProvider';
import { useCart } from './useCart';

// useCart together with CartProvider: the cart as the components use it
function renderCart() {
  return renderHook(() => useCart(), { wrapper: CartProvider });
}

describe('useCart', () => {
  it('starts with an empty cart', () => {
    const { result } = renderCart();

    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('counts the lines and adds up their prices', () => {
    const { result } = renderCart();

    act(() => {
      result.current.addItem(createCartItem({ price: 959 }));
      result.current.addItem(createCartItem({ price: 1089 }));
    });

    expect(result.current.count).toBe(2);
    expect(result.current.total).toBe(2048);
  });

  // Both lines come from the same data, with the same id: the cart must give each one its own id,
  // or removing one would remove both
  it('gives each new line its own id', () => {
    const { result } = renderCart();

    act(() => {
      result.current.addItem(createCartItem());
      result.current.addItem(createCartItem());
    });

    const [first, second] = result.current.items;
    expect(first.id).not.toBe(second.id);
  });

  it('removes a line and updates the count and the total', () => {
    const { result } = renderCart();
    act(() => {
      result.current.addItem(createCartItem({ price: 959 }));
      result.current.addItem(createCartItem({ price: 1089 }));
    });

    act(() => {
      result.current.removeItem(result.current.items[0].id);
    });

    expect(result.current.count).toBe(1);
    expect(result.current.total).toBe(1089);
  });

  it('keeps the cart after reloading the page', () => {
    const firstVisit = renderCart();
    act(() => {
      firstVisit.result.current.addItem(createCartItem());
    });
    firstVisit.unmount();

    const { result } = renderCart();

    expect(result.current.count).toBe(1);
  });

  it('throws a clear error when used outside CartProvider', () => {
    // React also logs the error it catches: silenced so it doesn't fill the test output
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useCart())).toThrow('useCart must be used within a CartProvider');
  });
});
