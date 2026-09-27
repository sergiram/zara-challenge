import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';
import styles from './CartFooter.module.scss';

interface CartFooterProps {
  total: number;
  isEmpty: boolean;
}

export const CartFooter = ({ total, isEmpty }: CartFooterProps) => {
  return (
    <div className={styles.footer}>
      <Link to="/" className={styles.continue}>
        Continue Shopping
      </Link>
      {!isEmpty && (
        <>
          <p className={styles.total}>
            Total <span>{formatPrice(total)}</span>
          </p>
          <button type="button" className={styles.pay}>
            Pay
          </button>
        </>
      )}
    </div>
  );
};
