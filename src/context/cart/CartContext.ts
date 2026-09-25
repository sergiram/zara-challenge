import { createContext } from 'react';
import type { CartItem } from '../../types/cart';

export interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
}

export const CartContext = createContext<CartContextValue | null>(null);
