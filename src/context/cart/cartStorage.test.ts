import { describe, expect, it, vi } from 'vitest';
import { createCartItem } from '../../test/fixtures';
import { CART_STORAGE_KEY, loadCart, saveCart } from './cartStorage';

describe('cartStorage', () => {
  it('loads an empty cart when nothing is saved', () => {
    expect(loadCart()).toEqual([]);
  });

  it('loads the items saved before', () => {
    const items = [createCartItem({ id: 'line-1' }), createCartItem({ id: 'line-2' })];

    saveCart(items);

    expect(loadCart()).toEqual(items);
  });

  it('loads an empty cart when the saved data is not valid JSON', () => {
    localStorage.setItem(CART_STORAGE_KEY, '{broken');

    expect(loadCart()).toEqual([]);
  });

  it('loads an empty cart when the saved data is not a list', () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ id: 'line-1' }));

    expect(loadCart()).toEqual([]);
  });

  it('does not throw when the storage is full', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('The quota has been exceeded', 'QuotaExceededError');
    });

    expect(() => saveCart([createCartItem()])).not.toThrow();
  });
});
