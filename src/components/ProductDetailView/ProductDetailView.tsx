import type { ProductDetail } from '../../types/product';
import { formatPrice } from '../../utils/formatPrice';

interface ProductDetailViewProps {
  product: ProductDetail;
}

export const ProductDetailView = ({ product }: ProductDetailViewProps) => {
  const { brand, name, basePrice } = product;

  return (
    <article>
      <p>{brand}</p>
      <h1>{name}</h1>
      <p>From {formatPrice(basePrice)}</p>
    </article>
  );
};
