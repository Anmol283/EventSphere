const testStorage = {
    init: function() {
        // Test data
        const testData = {
            timestamp: new Date().toISOString(),
            testValue: 'EventSphere Test Data'
        };

        // Test localStorage
        try {
            localStorage.setItem('eventSphereTest', JSON.stringify(testData));
            console.log('✅ localStorage write test passed');
        } catch (e) {
            console.error('❌ localStorage write failed:', e);
        }

        // Test sessionStorage
        try {
            sessionStorage.setItem('eventSphereSession', JSON.stringify(testData));
            console.log('✅ sessionStorage write test passed');
        } catch (e) {
            console.error('❌ sessionStorage write failed:', e);
        }

        // Read and display test
        this.displayStorageContents();
    },

    displayStorageContents: function() {
        console.group('Storage Contents');
        console.log('localStorage:', {
            testData: JSON.parse(localStorage.getItem('eventSphereTest') || 'null'),
            allKeys: Object.keys(localStorage)
        });
        console.log('sessionStorage:', {
            testData: JSON.parse(sessionStorage.getItem('eventSphereSession') || 'null'),
            allKeys: Object.keys(sessionStorage)
        });
        console.groupEnd();
    }
};