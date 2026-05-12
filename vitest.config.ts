import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: false,
        environment: 'node',
        include: ['tests/api/**/*.test.ts'],
        testTimeout: 10000
    },
});