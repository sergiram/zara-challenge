const priceFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  useGrouping: false,
});

export function formatPrice(price: number): string {
  return `${priceFormatter.format(price)} EUR`;
}
