import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '../services/apiClient';
import { getProductById } from '../services/productService';
import { createDeferred } from '../test/deferred';
import { createProductDetail } from '../test/fixtures';
import type { ProductDetail } from '../types/product';
import { useProduct } from './useProduct';

vi.mock('../services/productService');

const mockedGetProductById = vi.mocked(getProductById);

const iphone = createProductDetail({ id: 'APL-IP15', name: 'iPhone 15' });
const galaxy = createProductDetail({ id: 'SMG-S24', brand: 'Samsung', name: 'Galaxy S24' });

describe('useProduct', () => {
  it('loads the product with the given id', async () => {
    mockedGetProductById.mockResolvedValue(iphone);

    const { result } = renderHook(() => useProduct('APL-IP15'));

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.product).toEqual(iphone);
    expect(mockedGetProductById).toHaveBeenCalledWith('APL-IP15', expect.any(AbortSignal));
  });

  // The page needs the original error to tell a missing product (404) from any other failure
  it('returns the error of the API when the product cannot be loaded', async () => {
    const error = new ApiRequestError(404, 'Product not found');
    mockedGetProductById.mockRejectedValue(error);

    const { result } = renderHook(() => useProduct('MISSING'));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe(error);
  });

  // Opening a similar product changes the id: if the previous product arrives late, it must not
  // replace the one the user is now looking at
  it('ignores the answer for a previous id', async () => {
    const previousProduct = createDeferred<ProductDetail>();
    mockedGetProductById.mockReturnValueOnce(previousProduct.promise).mockResolvedValueOnce(galaxy);
    const { result, rerender } = renderHook(({ id }) => useProduct(id), {
      initialProps: { id: 'APL-IP15' },
    });

    rerender({ id: 'SMG-S24' });
    await waitFor(() => expect(result.current.product).toEqual(galaxy));
    await act(async () => {
      previousProduct.resolve(iphone);
    });

    expect(result.current.product).toEqual(galaxy);
  });
});
