import type { CartItem } from '../../types/cart';

export type CartState = CartItem[];
export type CartAction =
  { type: 'ADD_ITEM'; payload: CartItem } | { type: 'REMOVE_ITEM'; payload: string };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      return [...state, action.payload];
    case 'REMOVE_ITEM':
      return state.filter((item) => item.id !== action.payload);
  }
}
