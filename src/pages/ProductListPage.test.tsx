import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { getProducts } from '../services/productService';
import { getA11yViolations } from '../test/axe';
import { createProductSummary } from '../test/fixtures';
import { renderApp } from '../test/render';

vi.mock('../services/productService');

const mockedGetProducts = vi.mocked(getProducts);

const iphone = createProductSummary({ id: 'APL-IP15', name: 'iPhone 15', basePrice: 959 });
const galaxy = createProductSummary({
  id: 'SMG-S24',
  brand: 'Samsung',
  name: 'Galaxy S24',
  basePrice: 1329,
});

describe('ProductListPage', () => {
  it('shows a loading bar until the products arrive', async () => {
    mockedGetProducts.mockResolvedValue([iphone]);

    renderApp('/');

    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', { name: 'Cargando productos' }),
    );
    expect(screen.getByRole('link', { name: /iphone 15/i })).toBeInTheDocument();
  });

  it('shows the products with the number of results', async () => {
    mockedGetProducts.mockResolvedValue([iphone, galaxy]);

    renderApp('/');

    expect(await screen.findByText('2 results')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /iphone 15/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /galaxy s24/i })).toBeInTheDocument();
  });

  it('searches once the user stops typing', async () => {
    mockedGetProducts.mockResolvedValueOnce([iphone, galaxy]).mockResolvedValueOnce([galaxy]);
    const { user, router } = renderApp('/');
    await screen.findByText('2 results');

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'galaxy');

    expect(await screen.findByText('1 result')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /iphone 15/i })).not.toBeInTheDocument();
    // One request for the first load and one for the whole word, not one per letter
    expect(mockedGetProducts).toHaveBeenCalledTimes(2);
    expect(mockedGetProducts).toHaveBeenLastCalledWith({
      search: 'galaxy',
      signal: expect.any(AbortSignal),
    });
    // The search is kept in the URL, so going back from a product returns to the same results
    expect(router.state.location.search).toBe('?search=galaxy');
  });

  it('starts with the search that comes in the URL', async () => {
    mockedGetProducts.mockResolvedValue([galaxy]);

    renderApp('/?search=galaxy');

    expect(await screen.findByText('1 result')).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('galaxy');
    expect(mockedGetProducts).toHaveBeenCalledWith({
      search: 'galaxy',
      signal: expect.any(AbortSignal),
    });
  });

  it('says so when the products cannot be loaded', async () => {
    mockedGetProducts.mockRejectedValue(new Error('Network down'));

    renderApp('/');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se han podido cargar los productos',
    );
  });

  it('has no accessibility problems', async () => {
    mockedGetProducts.mockResolvedValue([iphone, galaxy]);
    const { container } = renderApp('/');
    await screen.findByText('2 results');

    expect(await getA11yViolations(container)).toEqual([]);
  });
});
