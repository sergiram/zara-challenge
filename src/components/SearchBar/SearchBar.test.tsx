import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SearchBar } from './SearchBar';

function renderSearchBar(props: Partial<ComponentProps<typeof SearchBar>> = {}) {
  const onChange = vi.fn();
  const user = userEvent.setup();

  render(<SearchBar value="" onChange={onChange} resultsCount={null} {...props} />);

  return { onChange, user };
}

describe('SearchBar', () => {
  it('shows the text being searched', () => {
    renderSearchBar({ value: 'iphone' });

    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('iphone');
  });

  it('sends the new text when the user types', async () => {
    const { onChange, user } = renderSearchBar({ value: 'iphon' });

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'e');

    expect(onChange).toHaveBeenCalledWith('iphone');
  });

  it('hides the clear button when there is no text', () => {
    renderSearchBar({ value: '' });

    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  it('clears the search and puts the focus back on the field', async () => {
    const { onChange, user } = renderSearchBar({ value: 'iphone' });

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(onChange).toHaveBeenCalledWith('');
    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveFocus();
  });

  it('shows the number of results', () => {
    renderSearchBar({ resultsCount: 3 });

    expect(screen.getByText('3 results')).toBeInTheDocument();
  });

  it('uses the singular for one result', () => {
    renderSearchBar({ resultsCount: 1 });

    expect(screen.getByText('1 result')).toBeInTheDocument();
  });

  it('shows no number while the products load', () => {
    renderSearchBar({ resultsCount: null });

    expect(screen.queryByText(/result/)).not.toBeInTheDocument();
  });
});
