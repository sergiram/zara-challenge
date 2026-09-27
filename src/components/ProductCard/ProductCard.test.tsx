import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createProductSummary } from '../../test/fixtures';
import { renderWithProviders } from '../../test/render';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  it('shows the brand, the name and the price', () => {
    renderWithProviders(<ProductCard product={createProductSummary()} />);

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('959 EUR')).toBeInTheDocument();
  });

  it('links to the product detail', () => {
    renderWithProviders(<ProductCard product={createProductSummary({ id: 'APL-IP15' })} />);

    expect(screen.getByRole('link', { name: /iphone 15/i })).toHaveAttribute(
      'href',
      '/product/APL-IP15',
    );
  });
});
