import { describe, expect, it } from 'vitest';
import { formatPrice } from './formatPrice';

describe('formatPrice', () => {
  it('adds the EUR currency after the price', () => {
    expect(formatPrice(999)).toBe('999 EUR');
  });

  it('does not add a thousands separator', () => {
    expect(formatPrice(1229)).toBe('1229 EUR');
  });

  it('shows decimals without trailing zeros', () => {
    expect(formatPrice(999.5)).toBe('999.5 EUR');
  });

  it('rounds to two decimals', () => {
    expect(formatPrice(99.456)).toBe('99.46 EUR');
  });
});
