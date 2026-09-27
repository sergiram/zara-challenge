import { useTrimmedImage } from '../../hooks/useTrimmedImage';
import type { CartItem } from '../../types/cart';
import { formatPrice } from '../../utils/formatPrice';
import styles from './CartLine.module.scss';

interface CartLineProps {
  item: CartItem;
  onRemove: (id: string) => void;
}

export const CartLine = ({ item, onRemove }: CartLineProps) => {
  const { brand, capacity, colorName, id, imageUrl, price, name } = item;
  const trimmedImageUrl = useTrimmedImage(imageUrl);

  return (
    <div className={styles.line}>
      <div className={styles.imageWrapper}>
        {trimmedImageUrl && <img className={styles.image} src={trimmedImageUrl} alt="" />}
      </div>
      <div className={styles.info}>
        <p className={styles.brand}>{brand}</p>
        <p>{name}</p>
        <p>
          {capacity} | {colorName}
        </p>
        <p className={styles.price}>{formatPrice(price)}</p>
        <button type="button" className={styles.remove} onClick={() => onRemove(id)}>
          Remove
          <span className="visually-hidden">
            {' '}
            {name} {capacity} {colorName}
          </span>
        </button>
      </div>
    </div>
  );
};
