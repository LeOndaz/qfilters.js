import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['src/**/*.{ts}', 'tests/**/*.{ts}', '.prettierrc.js', 'index.ts', 'index.d.ts'],
        languageOptions: {
            globals: {
                module: true,
            },
        },
    },
    {
        ignores: ['**/lib/**'],
    },
);
