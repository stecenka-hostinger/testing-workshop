module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'json', 'vue', 'ts'],
  transform: {
    '^.+\\.vue$': '<rootDir>/tests/vue3-jest-override.ts',
    '^.+\\.(t|j)s?$': '@swc/jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2|svg)$':
      'jest-transform-stub',
  },
  coveragePathIgnorePatterns: ['<rootDir>/tests/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },
  snapshotSerializers: ['jest-serializer-vue'],
  transformIgnorePatterns: [
    '/node_modules/(?!(babel-jest|@vue/vue3-jest|vue-router|@babel)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,vue,ts}',
    '!**/node_modules/**',
  ],
  coverageReporters: ['html', 'text-summary', 'lcov'],
  reporters: ['default'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  testMatch: ['<rootDir>/tests/**/(*.)test.(js|ts)'],
};
