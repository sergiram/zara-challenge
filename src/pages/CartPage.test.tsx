import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { saveCart } from '../context/cart/cartStorage';
import { getA11yViolations } from '../test/axe';
import { createCartItem } from '../test/fixtures';
import { renderApp } from '../test/render';

const iphoneLine = createCartItem({ id: 'line-1', price: 959 });
const galaxyLine = createCartItem({
  id: 'line-2',
  productId: 'SMG-S24',
  brand: 'Samsung',
  name: 'Galaxy S24',
  capacity: '256 GB',
  colorName: 'Onyx Black',
  price: 1229,
});

describe('CartPage', () => {
  it('shows the lines of the cart and the total', () => {
    saveCart([iphoneLine, galaxyLine]);

    renderApp('/cart');

    expect(screen.getByRole('heading', { level: 1, name: 'Cart (2)' })).toBeInTheDocument();
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('Galaxy S24')).toBeInTheDocument();
    expect(screen.getByText('Total')).toHaveTextContent('Total 2188 EUR');
  });

  it('removes a line and updates the count and the total', async () => {
    saveCart([iphoneLine, galaxyLine]);
    const { user } = renderApp('/cart');

    await user.click(screen.getByRole('button', { name: 'Remove Galaxy S24 256 GB Onyx Black' }));

    expect(screen.getByRole('heading', { level: 1, name: 'Cart (1)' })).toBeInTheDocument();
    expect(screen.queryByText('Galaxy S24')).not.toBeInTheDocument();
    expect(screen.getByText('Total')).toHaveTextContent('Total 959 EUR');
  });

  it('shows an empty cart with only the way back to the shop', () => {
    renderApp('/cart');

    expect(screen.getByRole('heading', { level: 1, name: 'Cart (0)' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Continue Shopping' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pay' })).not.toBeInTheDocument();
  });

  it('has no accessibility problems', async () => {
    saveCart([iphoneLine, galaxyLine]);
    const { container } = renderApp('/cart');

    expect(await getA11yViolations(container)).toEqual([]);
  });
});
