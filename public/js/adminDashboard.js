document.addEventListener('DOMContentLoaded', () => {
    // Store admin session data
    let pageViews = parseInt(sessionStorage.getItem('pageViews') || '0');
    const sessionInfo = {
        loginTime: new Date().toISOString(),
        pageViews: ++pageViews // Increment before storing
    };
    sessionStorage.setItem('adminSession', JSON.stringify(sessionInfo));
    sessionStorage.setItem('pageViews', pageViews.toString());

    // Store visit data
    let totalVisits = parseInt(localStorage.getItem('totalVisits') || '0');
    const visitData = {
        lastVisit: new Date().toISOString(),
        totalVisits: ++totalVisits // Increment before storing
    };
    localStorage.setItem('adminData', JSON.stringify(visitData));
    localStorage.setItem('totalVisits', totalVisits.toString());
<<<<<<< HEAD
});
=======
});

// JWT helpers: save/get token and helper for authenticated fetch
function saveToken(token) {
    if (!token) return;
    localStorage.setItem('authToken', token);
}

function getToken() {
    return localStorage.getItem('authToken');
}

function clearToken() {
    localStorage.removeItem('authToken');
}

// Wrapper around fetch that adds Authorization header when a token exists
async function authFetch(url, options = {}) {
    const token = getToken();
    const headers = options.headers ? Object.assign({}, options.headers) : {};

    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    const opts = Object.assign({}, options, { headers });
    return fetch(url, opts);
}

// Example usage helpers for login/logout flows (minimal):
async function apiLogin(username, password) {
    try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'same-origin'
            });

        const data = await res.json();
        if (res.ok && data.token) {
            saveToken(data.token);
            return { success: true, token: data.token };
        }

        return { success: false, error: data.message || 'Login failed' };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

function apiLogout() {
    clearToken();
    sessionStorage.removeItem('adminSession');
}

// Expose helpers to global scope for simple use in admin pages
window.authFetch = authFetch;
window.apiLogin = apiLogin;
window.apiLogout = apiLogout;
window.getToken = getToken;
>>>>>>> main
