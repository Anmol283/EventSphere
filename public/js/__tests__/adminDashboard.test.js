/**
 * @jest-environment jsdom
 */

describe('Admin Dashboard Storage', () => {
    beforeEach(() => {
        // Clear storage before each test
        localStorage.clear();
        sessionStorage.clear();
        
        // Reset the DOM
        document.body.innerHTML = '';
        
        // Mock Date.now() for consistent timestamps
        jest.spyOn(Date, 'now').mockImplementation(() => 1234567890);
    });

    afterEach(() => {
        // Cleanup
        jest.restoreAllMocks();
    });

    test('should initialize session storage with correct data', () => {
        // Load the admin dashboard script
        require('../adminDashboard.js');
        document.dispatchEvent(new Event('DOMContentLoaded'));
        
        // Get stored session data
        const sessionData = JSON.parse(sessionStorage.getItem('adminSession'));
        
        expect(sessionData).toBeDefined();
        expect(sessionData.pageViews).toBe(1);
        expect(sessionData.loginTime).toBeDefined();
    });

    test('should increment page views on multiple visits', () => {
        // Load the script multiple times
        require('../adminDashboard.js');
        
        // First visit
        document.dispatchEvent(new Event('DOMContentLoaded'));
        
        // Second visit
        document.dispatchEvent(new Event('DOMContentLoaded'));
        
        const sessionData = JSON.parse(sessionStorage.getItem('adminSession'));
        expect(sessionData.pageViews).toBe(2);
    });

    test('should store visit data in localStorage', () => {
        require('../adminDashboard.js');
        document.dispatchEvent(new Event('DOMContentLoaded'));
        
        const visitData = JSON.parse(localStorage.getItem('adminData'));
        
        expect(visitData).toBeDefined();
        expect(visitData.lastVisit).toBeDefined();
        expect(visitData.totalVisits).toBe(1);
    });

    test('should increment total visits count', () => {
        require('../adminDashboard.js');
        
        // First visit
        document.dispatchEvent(new Event('DOMContentLoaded'));
        
        // Second visit
        document.dispatchEvent(new Event('DOMContentLoaded'));
        
        const visitData = JSON.parse(localStorage.getItem('adminData'));
        expect(visitData.totalVisits).toBe(2);
    });
});
