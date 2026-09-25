import { useEffect, useState } from 'react';
import type { ProductSummary } from '../types/product';
import { getProducts } from '../services/productService';

export function useProducts(search: string) {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getProducts({ search, signal: controller.signal });
        if (controller.signal.aborted) return;
        setProducts(data);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err : new Error('Unexpected error'));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, [search]);

  return { products, isLoading, error };
}
