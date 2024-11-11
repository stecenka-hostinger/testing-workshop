import '@testing-library/jest-dom';
import 'core-js/stable/structured-clone';

const localStorageMock = () => {
  let store = {};

  return {
    getItem(key) {
      return store[key] ?? null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
    removeItem(key) {
      delete store[key];
    },
  };
};

global.window.scrollTo = jest.fn();

Object.defineProperty(window, 'localStorage', { value: localStorageMock() });
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: () => ({
    addEventListener: () => '',
    removeEventListener: () => '',
  }),
});

global.window.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}));

// Set env variables for testing
process.env.VITE_LOGOUT_REDIRECT_TEMPLATE = 'http://{BRAND}/login';
process.env.VITE_API_H_SSO = 'http://hsso.api';
process.env.VITE_BUILDER_PREVIEW_URL = '.hostingersite.com';
process.env.VITE_WORDPRESS_PREVIEW_URL = '.hostingersite.com';
