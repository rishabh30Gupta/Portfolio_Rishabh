import '@testing-library/jest-dom'

// Mock window.matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock scrollTo for smooth scroll tests
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: () => {},
});

// Mock scrollIntoView for navigation tests
Element.prototype.scrollIntoView = () => {};
