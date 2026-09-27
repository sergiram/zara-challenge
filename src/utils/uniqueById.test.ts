import { describe, expect, it } from 'vitest';
import { uniqueById } from './uniqueById';

describe('uniqueById', () => {
  it('returns the same items when no id is repeated', () => {
    const items = [
      { id: 'a', name: 'Galaxy S24' },
      { id: 'b', name: 'iPhone 15' },
    ];

    const result = uniqueById(items);

    expect(result).toEqual(items);
  });

  it('keeps the first item when an id is repeated', () => {
    const items = [
      { id: 'a', name: 'First' },
      { id: 'a', name: 'Second' },
    ];

    const result = uniqueById(items);

    expect(result).toEqual([{ id: 'a', name: 'First' }]);
  });

  it('keeps the original order of the items', () => {
    const items = [
      { id: 'c', name: 'Pixel 8' },
      { id: 'a', name: 'Galaxy S24' },
      { id: 'c', name: 'Pixel 8' },
      { id: 'b', name: 'iPhone 15' },
    ];

    const result = uniqueById(items);

    expect(result.map((item) => item.id)).toEqual(['c', 'a', 'b']);
  });

  it('returns an empty array for an empty list', () => {
    expect(uniqueById([])).toEqual([]);
  });
});
