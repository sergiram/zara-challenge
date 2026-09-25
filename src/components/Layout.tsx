import { Link, Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <>
      <header>
        <Link to="/">MBST</Link>
        <Link to="/cart">Cart</Link>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};
