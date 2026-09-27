import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { cartReducer } from './cartReducer';
import { loadCart, saveCart } from './cartStorage';
import type { CartItem } from '../../types/cart';
import { CartContext, type CartContextValue } from './CartContext';

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadCart);

  const addItem = useCallback((item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, id: crypto.randomUUID() } });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      total: items.reduce((sum, item) => sum + item.price, 0),
      addItem,
      removeItem,
    }),
    [items, addItem, removeItem],
  );

  useEffect(() => {
    saveCart(items);
  }, [items]);

  // Since React 19 the context itself is the provider (before, CartContext.Provider)
  return <CartContext value={value}>{children}</CartContext>;
};
