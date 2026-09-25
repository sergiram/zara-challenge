import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { CartProvider } from './context/cart/CartProvider';

export const App = () => {
  return (
    <CartProvider>
      <RouterProvider
        future={{
          v7_startTransition: true,
        }}
        router={router}
      />
    </CartProvider>
  );
};
