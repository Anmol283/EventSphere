const StorageTest = {
    runTest: function() {
        const results = {
            localStorage: false,
            sessionStorage: false,
            errors: []
        };

        try {
            // Test localStorage
            localStorage.setItem('test-local', 'test');
            const localValue = localStorage.getItem('test-local');
            results.localStorage = localValue === 'test';
            localStorage.removeItem('test-local');

            // Test sessionStorage
            sessionStorage.setItem('test-session', 'test');
            const sessionValue = sessionStorage.getItem('test-session');
            results.sessionStorage = sessionValue === 'test';
            sessionStorage.removeItem('test-session');

        } catch (error) {
            results.errors.push(error.message);
            console.error('Storage Test Error:', error);
        }

        return results;
    },

    displayResults: function(targetElement) {
        const results = this.runTest();
        const html = `
            <div class="alert ${results.errors.length ? 'alert-danger' : 'alert-success'} mt-3">
                <h6 class="fw-bold">Storage Test Results:</h6>
                <p class="mb-1">
                    <i class="fas ${results.localStorage ? 'fa-check text-success' : 'fa-times text-danger'}"></i>
                    LocalStorage: ${results.localStorage ? 'Working' : 'Failed'}
                </p>
                <p class="mb-1">
                    <i class="fas ${results.sessionStorage ? 'fa-check text-success' : 'fa-times text-danger'}"></i>
                    SessionStorage: ${results.sessionStorage ? 'Working' : 'Failed'}
                </p>
                ${results.errors.length ? `
                    <div class="mt-2 small text-danger">
                        Errors: ${results.errors.join(', ')}
                    </div>
                ` : ''}
            </div>
        `;
        
        targetElement.innerHTML = html;
    }
};