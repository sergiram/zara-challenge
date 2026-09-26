import type { ProductDetail, ProductSummary } from '../types/product';
import { toHttps } from '../utils/toHttps';
import { uniqueById } from '../utils/uniqueById';
import { apiFetch } from './apiClient';

const PRODUCTS_LIMIT = 20;
// The API repeats some ids, so we ask for a few extra to still show 20 unique products
const LIMIT_BUFFER = 5;

interface GetProductsOptions {
  search?: string;
  signal?: AbortSignal;
}

function normalizeSummary(product: ProductSummary): ProductSummary {
  return {
    ...product,
    imageUrl: toHttps(product.imageUrl),
  };
}

export async function getProducts({ search, signal }: GetProductsOptions = {}): Promise<
  ProductSummary[]
> {
  const products = await apiFetch<ProductSummary[]>('/products', {
    params: { search, limit: PRODUCTS_LIMIT + LIMIT_BUFFER },
    signal,
  });

  return uniqueById(products).slice(0, PRODUCTS_LIMIT).map(normalizeSummary);
}

export async function getProductById(id: string, signal?: AbortSignal): Promise<ProductDetail> {
  const product = await apiFetch<ProductDetail>(`/products/${encodeURIComponent(id)}`, {
    signal,
  });

  return {
    ...product,
    colorOptions: product.colorOptions.map((color) => ({
      ...color,
      imageUrl: toHttps(color.imageUrl),
    })),
    similarProducts: uniqueById(product.similarProducts).map(normalizeSummary),
  };
}
