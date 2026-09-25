export function toHttps(url: string): string {
  return url.replace(/^http:\/\//, 'https://');
}
