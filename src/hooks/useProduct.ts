import { getProductById } from '../services/productService';
import type { ProductDetail } from '../types/product';
import { useEffect, useState } from 'react';

export function useProduct(id: string) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchProductById() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getProductById(id, controller.signal);
        if (controller.signal.aborted) return;
        setProduct(data);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err : new Error('Unexpected error'));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    fetchProductById();

    return () => {
      controller.abort();
    };
  }, [id]);

  return { product, isLoading, error };
}
