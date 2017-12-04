'use strict';

module.exports = {
    'extends': ['eslint:recommended'],
    'env': {
        'node': true,
        'es6': true
    },
    'rules': {
        'array-bracket-spacing': [2, 'never'],
        'space-in-parens': [2, 'never'],
        'brace-style': [2, '1tbs'],
        'comma-spacing': [2, {'before': false, 'after': true}],
        'indent': [2, 4],
        'keyword-spacing': 2,
        'max-len': 0,
        'no-console': 1,
        'no-lonely-if': 2,
        'no-spaced-func': 2,
        'no-unused-vars': [2, { "vars": "all", "args": "none" }],
        'one-var': 0,
        'operator-linebreak': 0,
        'quote-props': [2, 'as-needed'],
        'quotes': [2, 'single'],
        'space-before-function-paren': [2, 'never'],
        'space-infix-ops': 2,
        'spaced-comment': 0
    }
};
