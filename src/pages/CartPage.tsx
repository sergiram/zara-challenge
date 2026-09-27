import { CartFooter } from '../components/CartFooter/CartFooter';
import { CartLine } from '../components/CartLine/CartLine';
import { useCart } from '../context/cart/useCart';
import styles from './CartPage.module.scss';

export const CartPage = () => {
  const { items, count, total, removeItem } = useCart();

  const isEmpty = count === 0;

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>Cart ({count})</h1>
        {!isEmpty && (
          <ul role="list" className={styles.list}>
            {items.map((item) => (
              <li key={item.id}>
                <CartLine item={item} onRemove={removeItem} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <CartFooter total={total} isEmpty={isEmpty} />
    </div>
  );
};
