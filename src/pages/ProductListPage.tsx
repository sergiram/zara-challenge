import { useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useProducts } from '../hooks/useProducts';

export const ProductListPage = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const { products, isLoading, error } = useProducts(debouncedSearch);

  return (
    <div>
      <input
        aria-label="Buscar"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <p>{isLoading ? 'Cargando…' : `${products.length} resultados`}</p>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};
