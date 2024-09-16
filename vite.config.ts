import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['tests/**/*.test.ts'],
        exclude: ['tests/fixtures/**/*.ts'],
        isolate: true,
        pool: 'threads',
        watch: true,
    },
});
