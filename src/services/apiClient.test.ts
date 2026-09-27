import { describe, expect, it, vi } from 'vitest';
import { ApiRequestError, apiFetch } from './apiClient';

// The base URL and the key are the fake ones from test.env in vite.config.ts

// Replaces the real fetch for one test: nothing goes out to the network, and the "server" answers
// with the response the test gives
function mockFetch(response: Response) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue(response);
}

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), init);
}

describe('apiFetch', () => {
  it('builds the URL from the path and the params', async () => {
    const fetchSpy = mockFetch(jsonResponse([]));

    await apiFetch('/products', { params: { search: 'iphone', limit: 25 } });

    const [url] = fetchSpy.mock.calls[0];
    expect(String(url)).toBe('https://api.example.com/products?search=iphone&limit=25');
  });

  it('leaves out empty params', async () => {
    const fetchSpy = mockFetch(jsonResponse([]));

    await apiFetch('/products', { params: { search: '', limit: undefined } });

    const [url] = fetchSpy.mock.calls[0];
    expect(String(url)).toBe('https://api.example.com/products');
  });

  it('sends the API key and the abort signal', async () => {
    const fetchSpy = mockFetch(jsonResponse([]));
    const controller = new AbortController();

    await apiFetch('/products', { signal: controller.signal });

    const [, options] = fetchSpy.mock.calls[0];
    expect(options?.headers).toEqual({ 'x-api-key': 'test-api-key' });
    expect(options?.signal).toBe(controller.signal);
  });

  it('returns the response body', async () => {
    mockFetch(jsonResponse([{ id: 'APL-IP15' }]));

    const result = await apiFetch('/products');

    expect(result).toEqual([{ id: 'APL-IP15' }]);
  });

  it('throws an ApiRequestError with the status and the API message', async () => {
    mockFetch(jsonResponse({ error: 'Not Found', message: 'Product not found' }, { status: 404 }));

    const request = apiFetch('/products/missing');

    await expect(request).rejects.toThrow(ApiRequestError);
    await expect(request).rejects.toMatchObject({ status: 404, message: 'Product not found' });
  });

  it('uses the status text when the error has no JSON body', async () => {
    mockFetch(new Response('<h1>Bad gateway</h1>', { status: 502, statusText: 'Bad Gateway' }));

    const request = apiFetch('/products');

    await expect(request).rejects.toMatchObject({ status: 502, message: 'Bad Gateway' });
  });
});
