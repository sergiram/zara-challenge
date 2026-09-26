import { Link, useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';
import { ProductDetailView } from '../components/ProductDetailView/ProductDetailView';
import { useDelayedFlag } from '../hooks/useDelayedFlag';
import { ApiRequestError } from '../services/apiClient';
import { LoadingBar } from '../components/LoadingBar/LoadingBar';
import styles from './ProductDetailPage.module.scss';

export const ProductDetailPage = () => {
  const { id } = useParams() as { id: string };
  const { product, isLoading, error } = useProduct(id);
  const showLoadingBar = useDelayedFlag(isLoading);

  const isNotFound = error instanceof ApiRequestError && error.status === 404;

  return (
    <>
      {showLoadingBar && <LoadingBar label="Cargando producto" />}
      {error ? (
        <div role="alert" className={styles.message}>
          <p>
            {isNotFound
              ? 'Producto no encontrado.'
              : 'No se ha podido cargar el producto. Inténtalo de nuevo más tarde.'}
          </p>
          <Link to="/">Volver al listado</Link>
        </div>
      ) : (
        product && (
          <div key={product.id} className={styles.content}>
            <ProductDetailView product={product} />
          </div>
        )
      )}
    </>
  );
};
