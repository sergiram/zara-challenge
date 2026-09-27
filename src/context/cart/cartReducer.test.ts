import { describe, expect, it } from 'vitest';
import { createCartItem } from '../../test/fixtures';
import { cartReducer } from './cartReducer';

describe('cartReducer', () => {
  describe('ADD_ITEM', () => {
    it('adds the item at the end of the cart', () => {
      const iphone = createCartItem({ id: 'line-1' });
      const galaxy = createCartItem({ id: 'line-2', productId: 'SMG-S24', name: 'Galaxy S24' });

      const result = cartReducer([iphone], { type: 'ADD_ITEM', payload: galaxy });

      expect(result).toEqual([iphone, galaxy]);
    });

    it('keeps the same product twice as separate lines', () => {
      const first = createCartItem({ id: 'line-1' });
      const second = createCartItem({ id: 'line-2' });

      const result = cartReducer([first], { type: 'ADD_ITEM', payload: second });

      expect(result).toEqual([first, second]);
    });

    // React compares the old and new state with Object.is: if the reducer changed the same array
    // and returned it, React would see no change and the screen wouldn't update
    it('returns a new cart without changing the previous one', () => {
      const state = [createCartItem({ id: 'line-1' })];

      const result = cartReducer(state, {
        type: 'ADD_ITEM',
        payload: createCartItem({ id: 'line-2' }),
      });

      expect(result).not.toBe(state);
      expect(state).toHaveLength(1);
    });
  });

  describe('REMOVE_ITEM', () => {
    // Both lines are the same product: the line id tells them apart, not the product id
    it('removes only the line with that id', () => {
      const first = createCartItem({ id: 'line-1' });
      const second = createCartItem({ id: 'line-2' });

      const result = cartReducer([first, second], { type: 'REMOVE_ITEM', payload: 'line-1' });

      expect(result).toEqual([second]);
    });

    it('leaves the cart as it was when the id does not exist', () => {
      const items = [createCartItem({ id: 'line-1' })];

      const result = cartReducer(items, { type: 'REMOVE_ITEM', payload: 'missing' });

      expect(result).toEqual(items);
    });
  });
});
