const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },

  parser: 'vue-eslint-parser',

  parserOptions: {
    parser: '@typescript-eslint/parser',
  },

  ignorePatterns: ['types/**/*'],

  rules: {
    'no-console': [
      isProduction ? 'error' : 'off',
      {
        allow: ['error'],
      },
    ],
    'no-debugger': isProduction ? 'error' : 'off',
    'comma-dangle': 'off',
    eqeqeq: ['error', 'always'],
    'vue/no-multiple-template-root': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/script-setup-uses-vars': 'error',
    'vue/require-default-prop': 'off',
    'vue/no-deprecated-slot-attribute': 'off',
    'vue/no-v-html': 'off',
    'vue/no-v-text-v-html-on-component': 'off',
    'vue/require-explicit-emits': 'error',
    'vue/prop-name-casing': 'off',
    'vue/match-component-import-name': 'error',
    'vue/component-definition-name-casing': ['error', 'PascalCase'],
    'vue/component-tags-order': [
      'error',
      {
        order: ['script[setup]', 'template', 'style'],
      },
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 7,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    'vue/html-self-closing': [
      'error',
      {
        html: { normal: 'always', void: 'always', component: 'always' },
      },
    ],
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        ignores: ['/^hp-/'],
        registeredComponentsOnly: true,
        globals: [
          'Trans',
          'HButtonV1',
          'HButton',
          'HPortlet',
          'StatusIcon',
          'HActionMenu',
          'HList',
          'HListItem',
          'HFormDeprecated',
          'HFormFieldDeprecated',
          'HLabel',
          'RouterView',
          'Component',
          'RouterLink',
        ],
      },
    ],
    'vue/html-indent': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'arrow-parens': ['error', 'always'],
    'no-nested-ternary': 'error',
    'vue/attribute-hyphenation': [
      'error',
      'always',
      {
        ignore: [
          'customError',
          'sideMenuFixed',
          'currentRoute',
          'backButton',
          'isFullHeight',
          'noPadding',
          'feedbackOpen',
          'sideMenuComponentFile',
          'feedbackDisabled',
          'closeButton',
        ],
      },
    ],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
    'no-trailing-spaces': ['error'],
    'quote-props': ['error', 'as-needed'],
    semi: ['error', 'always'],
    'prefer-const': 'error',
    'no-var': 'error',
    'no-const-assign': 'error',
    'prefer-template': 'error',
    'object-shorthand': 'error',
    'template-curly-spacing': 'error',
    'no-array-constructor': 'error',
    'no-new-object': 'error',
    curly: ['error', 'multi-line'],
    'newline-before-return': ['error'],
    'import/newline-after-import': ['error', { count: 1 }],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', 'sibling', 'parent'],
        alphabetize: {
          order: 'asc',
        },
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        '': 'never',
        js: 'never',
        ts: 'never',
        vue: 'ignorePackages',
      },
    ],
    'import/first': 'error',
    'import/no-duplicates': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        fixStyle: 'separate-type-imports',
      },
    ],
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports':
      process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'func-style': 'error',
    'wrap-iife': 'error',
    'no-loop-func': 'error',
    'prefer-rest-params': 'error',
    'no-new-func': 'error',
    'prefer-promise-reject-errors': 'error',
    'no-else-return': 'error',
    'no-unneeded-ternary': 'error',
    'dot-notation': 'error',
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    'prefer-spread': 'error',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        printWidth: 80,
        trailingComma: 'all',
        htmlWhitespaceSensitivity: 'ignore',
      },
    ],
    'vue/order-in-components': 'off',
    'vue/match-component-file-name': [
      'error',
      {
        extensions: ['vue'],
        shouldMatchCase: false,
      },
    ],
    'arrow-spacing': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-body-style': ['error', 'as-needed'],
  },

  extends: [
    '@vue/typescript',
    'plugin:vue/base',
    'plugin:vue/vue3-recommended',
    'prettier',
    '@vue/prettier',
  ],

  plugins: [
    '@typescript-eslint',
    'import',
    'vue',
    'prettier',
    'modules-newlines',
    'unused-imports',
  ],
};
