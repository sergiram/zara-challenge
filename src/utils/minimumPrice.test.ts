import { describe, expect, it } from 'vitest';
import { minimumPrice } from './minimumPrice';

describe('minimumPrice', () => {
  it('returns the cheapest storage price', () => {
    const options = [
      { capacity: '256 GB', price: 1229 },
      { capacity: '512 GB', price: 1329 },
    ];

    const result = minimumPrice(options, 1329);

    expect(result).toBe(1229);
  });

  it('returns the cheapest price when the options are not sorted', () => {
    const options = [
      { capacity: '512 GB', price: 1329 },
      { capacity: '128 GB', price: 1099 },
      { capacity: '256 GB', price: 1229 },
    ];

    expect(minimumPrice(options, 1329)).toBe(1099);
  });

  it('returns the price of the only option', () => {
    const options = [{ capacity: '128 GB', price: 899 }];

    expect(minimumPrice(options, 999)).toBe(899);
  });

  it('returns the base price when there are no storage options', () => {
    expect(minimumPrice([], 999)).toBe(999);
  });

  it('ignores a base price lower than every option', () => {
    const options = [
      { capacity: '256 GB', price: 200 },
      { capacity: '512 GB', price: 300 },
    ];

    expect(minimumPrice(options, 100)).toBe(200);
  });
});
