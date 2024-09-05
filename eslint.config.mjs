import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
    files: ['src/**/*.{js,ts}', 'tests/**/*.{js,ts}', '.prettierrc.js'],
    languageOptions: {
        globals: {
            module: true,
        },
    },
    rules: {
        'no-case-declarations': 'off',
    },
});
