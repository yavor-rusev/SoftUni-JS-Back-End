import globals from 'globals';
import pluginJs from '@eslint/js';

// /** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    {
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'script',
            globals: {
                ...globals.browser,
                ...globals.node,
                expect: true,
            },
        },
        rules: {
            semi: 'error',
            curly: 'error',
            quotes: ['warn', 'single'],
            'no-undef': 'error',
            indent: ['error', 4],
            'no-unused-vars': 'error',
        },
    },
    {
        // Override for `.mjs` files
        files: ['**/*.mjs'],
        languageOptions: {
            sourceType: 'module', // Ensure it's treated as ES modules
        }        
    },
    {
        // Override for `.mjs` files
        files: ['Model.js'],
        languageOptions: {}        
    },
    pluginJs.configs.recommended,
];
