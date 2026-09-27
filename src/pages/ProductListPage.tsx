import { useDebounce } from '../hooks/useDebounce';
import { useProducts } from '../hooks/useProducts';
import { useSearchParams } from 'react-router-dom';
import { LoadingBar } from '../components/LoadingBar/LoadingBar';
import { SearchBar } from '../components/SearchBar/SearchBar';
import { ProductList } from '../components/ProductList/ProductList';
import styles from './ProductListPage.module.scss';

export const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const debouncedSearch = useDebounce(search.trim());
  const { products, isLoading, error } = useProducts(debouncedSearch);

  const handleSearchChange = (value: string) => {
    setSearchParams(value ? { search: value } : {}, { replace: true });
  };

  const firstLoad = isLoading && products.length === 0;

  return (
    <div className={styles.page}>
      <h1 className="visually-hidden">Smartphones</h1>
      {isLoading && <LoadingBar label="Loading products" />}
      <SearchBar
        value={search}
        onChange={handleSearchChange}
        resultsCount={firstLoad || error ? null : products.length}
      />
      <div className={styles.content}>
        {error ? (
          <p role="alert">Couldn't load the products. Please try again later.</p>
        ) : (
          // Mounted when the first results arrive, so they fade in instead of popping up. While
          // searching it stays mounted with the previous results, so it doesn't fade on every key
          !firstLoad && (
            <div className={styles.results}>
              <ProductList products={products} />
            </div>
          )
        )}
      </div>
    </div>
  );
};
