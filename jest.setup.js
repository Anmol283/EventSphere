require('@testing-library/jest-dom');

// Mock localStorage and sessionStorage
const mockStorage = () => {
    let storage = {};
    return {
        getItem: (key) => storage[key] || null,
        setItem: (key, value) => storage[key] = String(value),
        removeItem: (key) => delete storage[key],
        clear: () => storage = {},
        length: Object.keys(storage).length,
        key: (i) => Object.keys(storage)[i]
    };
};

global.window = {
    localStorage: mockStorage(),
    sessionStorage: mockStorage()
};

global.document = {
    addEventListener: jest.fn(),
    dispatchEvent: jest.fn()
};