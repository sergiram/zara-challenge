import { describe, expect, it, vi } from 'vitest';
import { createProductDetail, createProductSummary } from '../test/fixtures';
import { apiFetch } from './apiClient';
import { getProductById, getProducts } from './productService';

// Swaps every export of apiClient for an empty mock: these tests check what the service does with
// the data, and each one decides what the "API" answers
vi.mock('./apiClient');

const mockedApiFetch = vi.mocked(apiFetch);

describe('getProducts', () => {
  it('sends the search text and the abort signal to the API', async () => {
    mockedApiFetch.mockResolvedValue([]);
    const controller = new AbortController();

    await getProducts({ search: 'iphone', signal: controller.signal });

    const [path, options] = mockedApiFetch.mock.calls[0];
    expect(path).toBe('/products');
    expect(options?.params?.search).toBe('iphone');
    expect(options?.signal).toBe(controller.signal);
  });

  // The API repeats some ids, so it has to ask for more than the 20 it shows
  it('asks the API for more than 20 products', async () => {
    mockedApiFetch.mockResolvedValue([]);

    await getProducts();

    const [, options] = mockedApiFetch.mock.calls[0];
    expect(options?.params?.limit).toBeGreaterThan(20);
  });

  it('returns 20 unique products even when the API repeats some', async () => {
    const unique = Array.from({ length: 22 }, (_, index) =>
      createProductSummary({ id: `id-${index}` }),
    );
    // 25 products: the first 3 come twice
    mockedApiFetch.mockResolvedValue([...unique.slice(0, 3), ...unique]);

    const result = await getProducts();

    expect(result.map((product) => product.id)).toEqual(
      unique.slice(0, 20).map((product) => product.id),
    );
  });

  it('switches the image URLs to https', async () => {
    mockedApiFetch.mockResolvedValue([
      createProductSummary({ imageUrl: 'http://example.com/iphone-15.png' }),
    ]);

    const [product] = await getProducts();

    expect(product.imageUrl).toBe('https://example.com/iphone-15.png');
  });
});

describe('getProductById', () => {
  it('requests the product by its id with the abort signal', async () => {
    mockedApiFetch.mockResolvedValue(createProductDetail());
    const controller = new AbortController();

    await getProductById('APL-IP15', controller.signal);

    const [path, options] = mockedApiFetch.mock.calls[0];
    expect(path).toBe('/products/APL-IP15');
    expect(options?.signal).toBe(controller.signal);
  });

  // The id comes from the page URL: a "/" or "?" in it must not change the path of the request
  it('encodes the id for the URL', async () => {
    mockedApiFetch.mockResolvedValue(createProductDetail());

    await getProductById('APL/IP15?x=1');

    const [path] = mockedApiFetch.mock.calls[0];
    expect(path).toBe('/products/APL%2FIP15%3Fx%3D1');
  });

  it('switches the color image URLs to https', async () => {
    mockedApiFetch.mockResolvedValue(
      createProductDetail({
        colorOptions: [
          { name: 'Black', hexCode: '#000000', imageUrl: 'http://example.com/black.png' },
        ],
      }),
    );

    const product = await getProductById('APL-IP15');

    expect(product.colorOptions[0].imageUrl).toBe('https://example.com/black.png');
  });

  it('removes repeated similar products', async () => {
    const galaxy = createProductSummary({ id: 'SMG-S24' });
    const pixel = createProductSummary({ id: 'GPX-8' });
    mockedApiFetch.mockResolvedValue(
      createProductDetail({ similarProducts: [galaxy, pixel, galaxy] }),
    );

    const product = await getProductById('APL-IP15');

    expect(product.similarProducts).toEqual([galaxy, pixel]);
  });

  it('switches the similar product images to https', async () => {
    mockedApiFetch.mockResolvedValue(
      createProductDetail({
        similarProducts: [createProductSummary({ imageUrl: 'http://example.com/galaxy.png' })],
      }),
    );

    const product = await getProductById('APL-IP15');

    expect(product.similarProducts[0].imageUrl).toBe('https://example.com/galaxy.png');
  });
});
