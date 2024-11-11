module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-object-rest-spread',
    'babel-plugin-syntax-trailing-function-commas',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
  overrides: [
    {
      test: './translations/*',
      compact: true,
    },
    {
      test: './node_modules/*',
      compact: true,
    },
  ],
};
