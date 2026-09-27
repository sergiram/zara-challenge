import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createProductSummary } from '../../test/fixtures';
import { renderWithProviders } from '../../test/render';
import { SimilarProducts } from './SimilarProducts';

// Dragging the list with the mouse isn't tested: jsdom has no layout, so nothing can scroll
describe('SimilarProducts', () => {
  it('shows a card for each similar product', () => {
    const products = [
      createProductSummary({ id: 'SMG-S24', name: 'Galaxy S24' }),
      createProductSummary({ id: 'GPX-8', name: 'Pixel 8' }),
    ];

    renderWithProviders(<SimilarProducts products={products} />);

    expect(screen.getByRole('heading', { name: 'Similar items' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /galaxy s24/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /pixel 8/i })).toBeInTheDocument();
  });

  it('shows nothing when there are no similar products', () => {
    renderWithProviders(<SimilarProducts products={[]} />);

    expect(screen.queryByRole('heading', { name: 'Similar items' })).not.toBeInTheDocument();
  });
});
