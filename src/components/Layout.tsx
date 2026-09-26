import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar/Navbar';
import styles from './Layout.module.scss';

export const Layout = () => {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
};
