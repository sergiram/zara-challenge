import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createCartItem } from '../../test/fixtures';
import { CartLine } from './CartLine';

describe('CartLine', () => {
  it('shows the phone, the chosen options and the price', () => {
    render(<CartLine item={createCartItem()} onRemove={vi.fn()} />);

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('128 GB | Black')).toBeInTheDocument();
    expect(screen.getByText('959 EUR')).toBeInTheDocument();
  });

  // The button is found by its full name: with several lines, each Remove says which phone it removes
  it('asks to remove its line when Remove is clicked', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<CartLine item={createCartItem({ id: 'line-7' })} onRemove={onRemove} />);

    await user.click(screen.getByRole('button', { name: 'Remove iPhone 15 128 GB Black' }));

    expect(onRemove).toHaveBeenCalledWith('line-7');
  });
});
