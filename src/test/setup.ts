import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// jsdom neither loads images nor draws on a canvas, so the crop would never finish: in the tests
// the components get the original image URL straight away
vi.mock('../hooks/useTrimmedImage', () => ({ useTrimmedImage: (src: string) => src }));
vi.mock('../utils/trimImage', () => ({ trimImage: (src: string) => Promise.resolve(src) }));

// jsdom doesn't implement scrolling, and ScrollRestoration scrolls to the top on every navigation
window.scrollTo = () => {};

afterEach(() => {
  cleanup();
  // jsdom keeps localStorage for the whole file, so a cart saved in one test would leak into the next
  localStorage.clear();
});
