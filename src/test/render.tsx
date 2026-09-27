import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { CartProvider } from '../context/cart/CartProvider';
import { routes } from '../routes';

type MemoryRouter = ReturnType<typeof createMemoryRouter>;

// Same providers as App, with a router that keeps its history in memory instead of the address bar.
// The returned router tells a test where a link or a button went
function renderWithRouter(router: MemoryRouter) {
  const user = userEvent.setup();
  const result = render(
    <CartProvider>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </CartProvider>,
  );

  return { ...result, user, router };
}

/** Renders the whole app at a URL: real routes, layout, navbar and cart */
export function renderApp(url = '/') {
  return renderWithRouter(createMemoryRouter(routes, { initialEntries: [url] }));
}

/** Renders one component inside the cart and a router, so its links and navigate() work */
export function renderWithProviders(ui: ReactElement, { url = '/' } = {}) {
  return renderWithRouter(
    createMemoryRouter([{ path: '*', element: ui }], { initialEntries: [url] }),
  );
}
