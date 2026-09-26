import type { ProductSummary } from '../../types/product';
import { ProductCard } from '../ProductCard/ProductCard';
import styles from './ProductList.module.scss';

interface ProductListProps {
  products: ProductSummary[];
}

export const ProductList = ({ products }: ProductListProps) => {
  return (
    <ul role="list" className={styles.grid}>
      {products.map((product) => (
        <li key={product.id} className={styles.item}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
};
