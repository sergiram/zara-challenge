import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Navbar } from './Navbar/Navbar';
import styles from './Layout.module.scss';

export const Layout = () => {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      {/* Scroll al top en nueva pagina y recupera el scroll al darle a atrás */}
      <ScrollRestoration />
    </>
  );
};
