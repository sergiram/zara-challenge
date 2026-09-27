/// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    // Fake API values: the tests never use the real URL or key, and don't need .env.local to run
    env: {
      VITE_API_BASE_URL: 'https://api.example.com',
      VITE_API_KEY: 'test-api-key',
    },
    // Before each test, empties the calls and answers of every mock and undoes every vi.spyOn, so
    // what one test fakes doesn't leak into the next one
    mockReset: true,
    restoreMocks: true,
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      // Entry point, types and test helpers: nothing there to cover
      exclude: ['src/main.tsx', 'src/vite-env.d.ts', 'src/types/**', 'src/test/**'],
    },
  },
});
