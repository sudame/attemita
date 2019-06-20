module.exports = {
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser'
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/recommended',
    ],
    rules: {
        'vue/html-closing-bracket-newline': [2, {multiline: 'never'}],
        'vue/html-self-closing': ['error', {
            html: {
                void: 'always',
                component: 'always',
                normal: 'never',
            },
        }],
        quotes: [2, 'single'],
        'quote-props': ['error', 'as-needed'],
        'no-var': 2,
        'node/no-unsupported-features/es-syntax': 0,
        'object-curly-spacing': ["error", "always"],
        semi: ["error", "always"]
    },
}
