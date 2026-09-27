import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { saveCart } from '../../context/cart/cartStorage';
import { createCartItem } from '../../test/fixtures';
import { renderWithProviders } from '../../test/render';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('links the logo to the home page', () => {
    renderWithProviders(<Navbar />);

    expect(screen.getByRole('link', { name: 'MBST, home' })).toHaveAttribute('href', '/');
  });

  it('links to the cart with how many items it has', () => {
    saveCart([createCartItem({ id: 'line-1' }), createCartItem({ id: 'line-2' })]);

    renderWithProviders(<Navbar />);

    const cartLink = screen.getByRole('link', { name: 'Cart, 2 items' });
    expect(cartLink).toHaveAttribute('href', '/cart');
    expect(cartLink).toHaveTextContent('2');
  });

  it('uses the singular for one item', () => {
    saveCart([createCartItem()]);

    renderWithProviders(<Navbar />);

    expect(screen.getByRole('link', { name: 'Cart, 1 item' })).toBeInTheDocument();
  });

  it('hides the cart link on the cart page', () => {
    renderWithProviders(<Navbar />, { url: '/cart' });

    expect(screen.queryByRole('link', { name: /cart/i })).not.toBeInTheDocument();
  });
});
