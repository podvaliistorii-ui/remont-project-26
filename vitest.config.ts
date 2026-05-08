import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // Using jsdom as the testing environment
    setupFiles: ['./src/test-setup.ts'], // Path to the setup file with mocks
  },
});
