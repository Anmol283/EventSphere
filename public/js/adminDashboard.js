document.addEventListener('DOMContentLoaded', () => {
    // Store admin session data
    const sessionInfo = {
        loginTime: new Date().toISOString(),
        pageViews: (parseInt(sessionStorage.getItem('pageViews') || '0')) + 1
    };
    sessionStorage.setItem('adminSession', JSON.stringify(sessionInfo));

    // Store visit data
    const visitData = {
        lastVisit: new Date().toISOString(),
        totalVisits: (parseInt(localStorage.getItem('totalVisits') || '0')) + 1
    };
    localStorage.setItem('adminData', JSON.stringify(visitData));
});