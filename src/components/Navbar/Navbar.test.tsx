import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { saveCart } from '../../context/cart/cartStorage';
import { createCartItem } from '../../test/fixtures';
import { renderWithProviders } from '../../test/render';
import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('links the logo to the home page', () => {
    renderWithProviders(<Navbar />);

    expect(screen.getByRole('link', { name: 'MBST, inicio' })).toHaveAttribute('href', '/');
  });

  it('links to the cart with how many products it has', () => {
    saveCart([createCartItem({ id: 'line-1' }), createCartItem({ id: 'line-2' })]);

    renderWithProviders(<Navbar />);

    const cartLink = screen.getByRole('link', { name: 'Carrito, 2 productos' });
    expect(cartLink).toHaveAttribute('href', '/cart');
    expect(cartLink).toHaveTextContent('2');
  });

  it('uses the singular for one product', () => {
    saveCart([createCartItem()]);

    renderWithProviders(<Navbar />);

    expect(screen.getByRole('link', { name: 'Carrito, 1 producto' })).toBeInTheDocument();
  });

  it('hides the cart link on the cart page', () => {
    renderWithProviders(<Navbar />, { url: '/cart' });

    expect(screen.queryByRole('link', { name: /carrito/i })).not.toBeInTheDocument();
  });
});
