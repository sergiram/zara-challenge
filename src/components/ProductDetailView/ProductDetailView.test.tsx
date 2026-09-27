import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { loadCart } from '../../context/cart/cartStorage';
import { createProductDetail } from '../../test/fixtures';
import { renderWithProviders } from '../../test/render';
import { ProductDetailView } from './ProductDetailView';

// Two colors (Black, Blue) and two storages (128 GB for 959, 256 GB for 1089)
const product = createProductDetail();

function renderDetail(detail = product) {
  return renderWithProviders(<ProductDetailView product={detail} />, {
    url: `/product/${detail.id}`,
  });
}

describe('ProductDetailView', () => {
  it('shows the lowest price until a storage is chosen', () => {
    renderDetail();

    expect(screen.getByText('From 959 EUR')).toBeInTheDocument();
  });

  it('shows the price of the chosen storage', async () => {
    const { user } = renderDetail();

    await user.click(screen.getByRole('radio', { name: '256 GB' }));

    expect(screen.getByText('1089 EUR')).toBeInTheDocument();
  });

  it('shows the image of the chosen color', async () => {
    const { user } = renderDetail();
    expect(screen.getByRole('img', { name: 'iPhone 15 Black' })).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: 'Blue' }));

    expect(screen.getByRole('img', { name: 'iPhone 15 Blue' })).toHaveAttribute(
      'src',
      'https://example.com/iphone-15-blue.png',
    );
  });

  it('only enables Add once a storage and a color are chosen', async () => {
    const { user } = renderDetail();
    const addButton = screen.getByRole('button', { name: 'Add' });
    expect(addButton).toBeDisabled();

    await user.click(screen.getByRole('radio', { name: '256 GB' }));
    expect(addButton).toBeDisabled();

    await user.click(screen.getByRole('radio', { name: 'Blue' }));
    expect(addButton).toBeEnabled();
  });

  it('chooses the options for the user when there is only one of each', () => {
    renderDetail(
      createProductDetail({
        colorOptions: [product.colorOptions[0]],
        storageOptions: [{ capacity: '128 GB', price: 959 }],
      }),
    );

    expect(screen.getByRole('radio', { name: '128 GB' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Black' })).toBeChecked();
    expect(screen.getByText('959 EUR')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeEnabled();
  });

  it('adds the chosen phone to the cart and goes to the cart', async () => {
    const { user, router } = renderDetail();

    await user.click(screen.getByRole('radio', { name: '256 GB' }));
    await user.click(screen.getByRole('radio', { name: 'Blue' }));
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(router.state.location.pathname).toBe('/cart');
    expect(loadCart()).toEqual([
      {
        id: expect.any(String),
        productId: 'APL-IP15',
        brand: 'Apple',
        name: 'iPhone 15',
        imageUrl: 'https://example.com/iphone-15-blue.png',
        colorName: 'Blue',
        capacity: '256 GB',
        price: 1089,
      },
    ]);
  });
});
