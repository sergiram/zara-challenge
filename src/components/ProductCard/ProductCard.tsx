import { Link } from 'react-router-dom';
import { useTrimmedImage } from '../../hooks/useTrimmedImage';
import type { ProductSummary } from '../../types/product';
import { formatPrice } from '../../utils/formatPrice';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: ProductSummary;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { basePrice, brand, id, imageUrl, name } = product;
  const trimmedImageUrl = useTrimmedImage(imageUrl);

  return (
    <Link to={`/product/${id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {trimmedImageUrl && <img className={styles.image} src={trimmedImageUrl} alt="" />}
      </div>
      <div className={styles.info}>
        <p className={styles.brand}>{brand}</p>
        <div className={styles.row}>
          <p>{name}</p>
          <p className={styles.price}>{formatPrice(basePrice)}</p>
        </div>
      </div>
    </Link>
  );
};
