import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProductSummary } from '../../types/product';
import { useDragToScroll } from '../../hooks/useDragToScroll';
import { ProductCard } from '../ProductCard/ProductCard';
import styles from './SimilarProducts.module.scss';

interface SimilarProductsProps {
  products: ProductSummary[];
}

// Position and size of the scrollbar thumb, as fractions of the list's width
interface Thumb {
  offset: number;
  size: number;
}

export const SimilarProducts = ({ products }: SimilarProductsProps) => {
  const listRef = useRef<HTMLUListElement>(null);
  const { isDragging, dragHandlers } = useDragToScroll<HTMLUListElement>();
  const [thumb, setThumb] = useState<Thumb>({ offset: 0, size: 1 });

  // Stable reference: the effect below depends on it, so a new function on every render would loop
  const updateThumb = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    const { scrollLeft, scrollWidth, clientWidth } = list;
    setThumb({ offset: scrollLeft / scrollWidth, size: clientWidth / scrollWidth });
  }, []);

  useEffect(() => {
    updateThumb();
    window.addEventListener('resize', updateThumb);

    return () => window.removeEventListener('resize', updateThumb);
  }, [updateThumb]);

  if (products.length === 0) return null;

  return (
    <section className={styles.similar}>
      <h2 className={styles.title}>Similar items</h2>
      <ul
        role="list"
        ref={listRef}
        className={`${styles.list} ${isDragging ? styles.dragging : ''}`}
        onScroll={updateThumb}
        {...dragHandlers}
      >
        {products.map((product) => (
          <li key={product.id} className={styles.item}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
      <div className={styles.track} aria-hidden="true">
        <div
          className={styles.thumb}
          style={{ left: `${thumb.offset * 100}%`, width: `${thumb.size * 100}%` }}
        />
      </div>
    </section>
  );
};
