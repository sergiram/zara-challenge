import { describe, expect, it } from 'vitest';
import { toHttps } from './toHttps';

describe('toHttps', () => {
  it('converts an http URL to https', () => {
    const url = 'http://example.com/images/phone.png';

    const result = toHttps(url);

    expect(result).toBe('https://example.com/images/phone.png');
  });

  it('leaves an https URL unchanged', () => {
    const url = 'https://example.com/images/phone.png';

    const result = toHttps(url);

    expect(result).toBe('https://example.com/images/phone.png');
  });

  it('only replaces http at the start of the URL', () => {
    const url = 'http://example.com/redirect?to=http://other.com';

    const result = toHttps(url);

    expect(result).toBe('https://example.com/redirect?to=http://other.com');
  });
});
