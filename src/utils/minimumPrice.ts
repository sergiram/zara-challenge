import type { StorageOption } from '../types/product';

export function minimumPrice(options: StorageOption[], basePrice: number): number {
  if (options.length === 0) return basePrice;

  return Math.min(...options.map((option) => option.price));
}
