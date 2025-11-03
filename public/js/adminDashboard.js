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
});