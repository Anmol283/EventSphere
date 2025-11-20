/// <reference types="cypress" />

describe('Admin Login Integration', () => {
    // Define the base URL and test credentials
    const BASE_URL = 'https://localhost:3000';
    // NOTE: Ensure your MongoDB 'admins' collection has an 'admin' user with 'password123'
    const ADMIN_USERNAME = 'anshu'; 
    const ADMIN_PASSWORD = 'anshu123'; 

    // 🆕 HOOK: Clear all browser data (cookies, localStorage) before the suite runs.
    // This ensures tests start with a clean state, preventing interference from previous runs.
    before(() => {
        cy.clearLocalStorage();
        cy.clearCookies();
    });
    
    // Ensure the application is accessible and ready before each test
    beforeEach(() => {
        // Visit the login page
        cy.visit(`${BASE_URL}/admin/login`);
        // We ensure a smooth start by checking the page title
        cy.title().should('include', 'Admin Login');
    });

    it('Should successfully load the admin login page', () => {
        // Assert that key elements are visible
        cy.get('form').should('be.visible');
        
        // FIX 1: Ensure assertion text matches your template (it should be 'Sign In')
        cy.get('button[type="submit"]').invoke('text').should('include', 'Sign In');
    });

    it('Should display an error message for invalid credentials', () => {
        // 1. Enter invalid credentials
        cy.get('input[name="username"]').type('invalid_user');
        cy.get('input[name="password"]').type('wrong_password');
        
        // 2. Submit the form
        cy.get('button[type="submit"]').click();

        // 3. Assert that the URL stays on the login page
        cy.url().should('include', '/admin/login');
        
        // 4. Assert error message visibility
        cy.get('body').should('contain', 'Invalid username or password.'); 
    });

    it('Should successfully log in and redirect to the admin dashboard', () => {
        // 1. Enter valid credentials
        cy.get('input[name="username"]').type(ADMIN_USERNAME);
        cy.get('input[name="password"]').type(ADMIN_PASSWORD);
        
        // 2. Submit the form
        cy.get('button[type="submit"]').click();

        // 3. ASSERTION 1: Verify the URL change (This is the critical check)
        cy.url().should('eq', `${BASE_URL}/admin`);
        
        // ASSERTION 2 (Negative Check): Ensure the error message is NOT present after submission
        cy.get('body').should('not.contain', 'Invalid username or password.'); 

        // 4. Check for dashboard content 
        cy.get('body').should('contain', 'Admin Dashboard');
        
        // Optional: Check for a success flash message
        cy.get('body').should('contain', 'Logged in successfully!');
    });

    // 🆕 New Test: Demonstrate managing and asserting values in browser localStorage
    it('Should correctly set, retrieve, and clear data in localStorage', () => {
        const CACHE_KEY = 'event_cache_timestamp';
        const CACHE_VALUE = Date.now().toString();

        // 1. Set a key-value pair directly in the browser's localStorage
        // cy.window().then() is used to access the global window object in the test browser
        cy.window().then((win) => {
            win.localStorage.setItem(CACHE_KEY, CACHE_VALUE);
        });
        
        // 2. Assert the value was set correctly by retrieving it
        cy.window().its('localStorage').invoke('getItem', CACHE_KEY).should('eq', CACHE_VALUE);

        // 3. Test clearing a specific key
        cy.clearLocalStorage(CACHE_KEY);
        
        // 4. Assert the key is now null (cleared)
        cy.window().its('localStorage').invoke('getItem', CACHE_KEY).should('be.null');
    });
});