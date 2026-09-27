import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar/Navbar';
import styles from './Layout.module.scss';

export const Layout = () => {
  const { pathname } = useLocation();

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div key={pathname} className={styles.page}>
          <Outlet />
        </div>
      </main>
      {/* Scrolls to the top on a new page and restores the position when going back */}
      <ScrollRestoration />
    </>
  );
};
