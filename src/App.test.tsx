import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { getProductById, getProducts } from './services/productService';
import { getA11yViolations } from './test/axe';
import { createProductDetail, createProductSummary } from './test/fixtures';
import { renderApp } from './test/render';

vi.mock('./services/productService');

// The whole app as a user goes through it, with only the API faked
describe('App', () => {
  // The real App, with the browser router. The other tests use renderApp, which mounts the same
  // routes in a memory router so each test can start at any URL
  it('opens on the product list', async () => {
    vi.mocked(getProducts).mockResolvedValue([createProductSummary()]);

    render(<App />);

    expect(await screen.findByText('1 result')).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeInTheDocument();
  });

  it('lets the user choose a phone, add it to the cart and remove it', async () => {
    vi.mocked(getProducts).mockResolvedValue([createProductSummary()]);
    vi.mocked(getProductById).mockResolvedValue(createProductDetail());
    const { user } = renderApp('/');

    await user.click(await screen.findByRole('link', { name: /iphone 15/i }));
    await user.click(await screen.findByRole('radio', { name: '256 GB' }));
    await user.click(screen.getByRole('radio', { name: 'Blue' }));
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Cart (1)' })).toBeInTheDocument();
    expect(screen.getByText('256 GB | Blue')).toBeInTheDocument();
    expect(screen.getByText('Total')).toHaveTextContent('Total 1089 EUR');

    await user.click(screen.getByRole('link', { name: 'Continue Shopping' }));
    await screen.findByRole('link', { name: /iphone 15/i });
    await user.click(screen.getByRole('link', { name: 'Cart, 1 item' }));
    await user.click(screen.getByRole('button', { name: /remove iphone 15/i }));

    expect(screen.getByRole('heading', { level: 1, name: 'Cart (0)' })).toBeInTheDocument();
  });

  it('shows a not found page for an unknown URL', async () => {
    const { container } = renderApp('/does-not-exist');

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
    expect(await getA11yViolations(container)).toEqual([]);
  });
});
