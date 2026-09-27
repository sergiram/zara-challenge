import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getProducts } from '../services/productService';
import { createDeferred } from '../test/deferred';
import { createProductSummary } from '../test/fixtures';
import type { ProductSummary } from '../types/product';
import { useProducts } from './useProducts';

vi.mock('../services/productService');

const mockedGetProducts = vi.mocked(getProducts);

const iphone = createProductSummary({ id: 'APL-IP15', name: 'iPhone 15' });
const galaxy = createProductSummary({ id: 'SMG-S24', brand: 'Samsung', name: 'Galaxy S24' });

describe('useProducts', () => {
  it('is loading until the products arrive', async () => {
    mockedGetProducts.mockResolvedValue([iphone]);

    const { result } = renderHook(() => useProducts(''));

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.products).toEqual([iphone]);
  });

  it('asks for the products that match the search', async () => {
    mockedGetProducts.mockResolvedValue([galaxy]);

    const { result } = renderHook(() => useProducts('galaxy'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockedGetProducts).toHaveBeenCalledWith({
      search: 'galaxy',
      signal: expect.any(AbortSignal),
    });
  });

  it('returns the error when the products cannot be loaded', async () => {
    const error = new Error('Network down');
    mockedGetProducts.mockRejectedValue(error);

    const { result } = renderHook(() => useProducts(''));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe(error);
    expect(result.current.products).toEqual([]);
  });

  // The list stays on screen while the new results load, instead of disappearing on every key
  it('keeps the previous products while a new search loads', async () => {
    mockedGetProducts
      .mockResolvedValueOnce([iphone, galaxy])
      .mockReturnValueOnce(createDeferred<ProductSummary[]>().promise);
    const { result, rerender } = renderHook(({ search }) => useProducts(search), {
      initialProps: { search: '' },
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    rerender({ search: 'galaxy' });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.products).toEqual([iphone, galaxy]);
  });

  // Typing fast starts several searches whose answers can arrive in any order: an old one arriving
  // late must not replace the results of the newest
  it('ignores the answer of a search replaced by a newer one', async () => {
    const oldSearch = createDeferred<ProductSummary[]>();
    mockedGetProducts.mockReturnValueOnce(oldSearch.promise).mockResolvedValueOnce([galaxy]);
    const { result, rerender } = renderHook(({ search }) => useProducts(search), {
      initialProps: { search: 'i' },
    });

    rerender({ search: 'galaxy' });
    await waitFor(() => expect(result.current.products).toEqual([galaxy]));
    await act(async () => {
      oldSearch.resolve([iphone]);
    });

    expect(result.current.products).toEqual([galaxy]);
  });
});
