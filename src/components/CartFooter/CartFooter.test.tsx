import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/render';
import { CartFooter } from './CartFooter';

describe('CartFooter', () => {
  it('shows the total and the Pay button when the cart has products', () => {
    renderWithProviders(<CartFooter total={2048} isEmpty={false} />);

    expect(screen.getByText('Total')).toHaveTextContent('Total 2048 EUR');
    expect(screen.getByRole('button', { name: 'Pay' })).toBeInTheDocument();
  });

  it('hides the total and the Pay button when the cart is empty', () => {
    renderWithProviders(<CartFooter total={0} isEmpty />);

    expect(screen.queryByText('Total')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pay' })).not.toBeInTheDocument();
  });

  it('always links back to the product list', () => {
    renderWithProviders(<CartFooter total={0} isEmpty />);

    expect(screen.getByRole('link', { name: 'Continue Shopping' })).toHaveAttribute('href', '/');
  });
});
