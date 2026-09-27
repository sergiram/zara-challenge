import type { CartItem } from '../types/cart';
import type { ProductDetail, ProductSummary } from '../types/product';

// Test data factories: they return a valid object and each test overrides only the fields it cares
// about, so what matters in the test stands out

export function createProductSummary(overrides: Partial<ProductSummary> = {}): ProductSummary {
  return {
    id: 'APL-IP15',
    brand: 'Apple',
    name: 'iPhone 15',
    basePrice: 959,
    imageUrl: 'https://example.com/iphone-15.png',
    ...overrides,
  };
}

export function createProductDetail(overrides: Partial<ProductDetail> = {}): ProductDetail {
  return {
    id: 'APL-IP15',
    brand: 'Apple',
    name: 'iPhone 15',
    description: 'The latest iPhone with Dynamic Island',
    basePrice: 959,
    rating: 4.6,
    specs: {
      screen: '6.1" Super Retina XDR',
      resolution: '2556 x 1179 pixels',
      processor: 'A16 Bionic',
      mainCamera: '48 MP',
      selfieCamera: '12 MP',
      battery: '3349 mAh',
      os: 'iOS 17',
      screenRefreshRate: '60 Hz',
    },
    colorOptions: [
      { name: 'Black', hexCode: '#000000', imageUrl: 'https://example.com/iphone-15-black.png' },
      { name: 'Blue', hexCode: '#d5dde0', imageUrl: 'https://example.com/iphone-15-blue.png' },
    ],
    storageOptions: [
      { capacity: '128 GB', price: 959 },
      { capacity: '256 GB', price: 1089 },
    ],
    similarProducts: [],
    ...overrides,
  };
}

export function createCartItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    id: 'line-1',
    productId: 'APL-IP15',
    brand: 'Apple',
    name: 'iPhone 15',
    imageUrl: 'https://example.com/iphone-15-black.png',
    colorName: 'Black',
    capacity: '128 GB',
    price: 959,
    ...overrides,
  };
}
