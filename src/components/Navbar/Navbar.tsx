import { Link, useLocation } from 'react-router-dom';
import { BagIcon } from '../icons/BagIcon';
import { Logo } from '../icons/Logo';
import styles from './Navbar.module.scss';
import { useCart } from '../../context/cart/useCart';

export const Navbar = () => {
  const { pathname } = useLocation();
  const isCartPage = pathname === '/cart';

  const { count: cartCount } = useCart();
  const cartLabel = `Carrito, ${cartCount} ${cartCount === 1 ? 'producto' : 'productos'}`;

  return (
    <header className={styles.navbar}>
      <nav className={styles.nav} aria-label="Principal">
        <Link to="/" className={styles.logo} aria-label="MBST, inicio">
          <Logo />
        </Link>
        {!isCartPage && (
          <Link to="/cart" className={styles.cart} aria-label={cartLabel}>
            <BagIcon filled={cartCount > 0} />
            <span className={styles.count}>{cartCount}</span>
          </Link>
        )}
      </nav>
    </header>
  );
};
