import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

export const App = () => {
  return (
    <RouterProvider
      future={{
        v7_startTransition: true,
      }}
      router={router}
    />
  );
};
