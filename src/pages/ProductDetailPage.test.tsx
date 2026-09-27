import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '../services/apiClient';
import { getProductById, getProducts } from '../services/productService';
import { getA11yViolations } from '../test/axe';
import { createProductDetail, createProductSummary } from '../test/fixtures';
import { renderApp } from '../test/render';

vi.mock('../services/productService');

const mockedGetProductById = vi.mocked(getProductById);
const mockedGetProducts = vi.mocked(getProducts);

const galaxySummary = createProductSummary({ id: 'SMG-S24', brand: 'Samsung', name: 'Galaxy S24' });
const iphone = createProductDetail({ similarProducts: [galaxySummary] });
const galaxy = createProductDetail({
  id: 'SMG-S24',
  brand: 'Samsung',
  name: 'Galaxy S24',
  storageOptions: [
    { capacity: '256 GB', price: 1229 },
    { capacity: '512 GB', price: 1329 },
  ],
});

describe('ProductDetailPage', () => {
  it('shows the product of the URL with its specifications', async () => {
    mockedGetProductById.mockResolvedValue(iphone);

    renderApp('/product/APL-IP15');

    expect(await screen.findByRole('heading', { level: 1, name: 'iPhone 15' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Specifications' })).toBeInTheDocument();
    expect(screen.getByText('A16 Bionic')).toBeInTheDocument();
    expect(mockedGetProductById).toHaveBeenCalledWith('APL-IP15', expect.any(AbortSignal));
  });

  it('says so when the product does not exist', async () => {
    mockedGetProductById.mockRejectedValue(new ApiRequestError(404, 'Product not found'));

    renderApp('/product/MISSING');

    expect(await screen.findByRole('alert')).toHaveTextContent('Producto no encontrado.');
  });

  it('shows a general error when the product cannot be loaded', async () => {
    mockedGetProductById.mockRejectedValue(new ApiRequestError(500, 'Internal Server Error'));

    renderApp('/product/APL-IP15');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se ha podido cargar el producto',
    );
  });

  // Each product starts from scratch: a storage chosen for the iPhone must not carry over to the
  // Galaxy, even though both have 256 GB
  it('opens a similar product with no options chosen', async () => {
    mockedGetProductById.mockImplementation(async (id) => (id === 'SMG-S24' ? galaxy : iphone));
    const { user } = renderApp('/product/APL-IP15');
    await user.click(await screen.findByRole('radio', { name: '256 GB' }));

    await user.click(screen.getByRole('link', { name: /galaxy s24/i }));

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Galaxy S24' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '256 GB' })).not.toBeChecked();
    expect(screen.getByText('From 1229 EUR')).toBeInTheDocument();
  });

  it('goes back to the product list', async () => {
    mockedGetProductById.mockResolvedValue(iphone);
    mockedGetProducts.mockResolvedValue([galaxySummary]);
    const { user, router } = renderApp('/product/APL-IP15');
    await screen.findByRole('heading', { level: 1, name: 'iPhone 15' });

    await user.click(screen.getByRole('link', { name: 'Back' }));

    expect(await screen.findByText('1 result')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
  });

  it('has no accessibility problems', async () => {
    mockedGetProductById.mockResolvedValue(iphone);
    const { container } = renderApp('/product/APL-IP15');
    await screen.findByRole('heading', { level: 1, name: 'iPhone 15' });

    expect(await getA11yViolations(container)).toEqual([]);
  });
});
