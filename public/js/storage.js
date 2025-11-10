const Storage = {
    // Local Storage Methods
    local: {
        setItem: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error('Error saving to localStorage:', e);
            }
        },
        
        getItem: (key) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Error reading from localStorage:', e);
                return null;
            }
        },
        
        removeItem: (key) => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error('Error removing from localStorage:', e);
            }
        }
    },

    // Session Storage Methods
    session: {
        setItem: (key, value) => {
            try {
                sessionStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error('Error saving to sessionStorage:', e);
            }
        },
        
        getItem: (key) => {
            try {
                const item = sessionStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error('Error reading from sessionStorage:', e);
                return null;
            }
        },
        
        removeItem: (key) => {
            try {
                sessionStorage.removeItem(key);
            } catch (e) {
                console.error('Error removing from sessionStorage:', e);
            }
        }
    }
};

const StorageTest = {
    testStorage: () => {
        // Test localStorage
        Storage.local.setItem('testKey', { test: 'Hello EventSphere!' });
        const localData = Storage.local.getItem('testKey');
        console.log('LocalStorage Test:', localData ? 'PASSED ✅' : 'FAILED ❌');
        
        // Test sessionStorage
        Storage.session.setItem('testKey', { test: 'Hello Session!' });
        const sessionData = Storage.session.getItem('testKey');
        console.log('SessionStorage Test:', sessionData ? 'PASSED ✅' : 'FAILED ❌');
        
        return {
            localStorage: localData,
            sessionStorage: sessionData
        };
    }
};