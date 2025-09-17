// ==========================================
// DODOD SAKETI ANALYTICS SYSTEM
// Real-time visitor tracking and statistics
// ==========================================

class DododAnalytics {
    constructor() {
        this.initializeStorage();
        this.trackVisit();
        this.updateDisplays();
        this.startRealTimeUpdates();
    }

    // Initialize localStorage with default values
    initializeStorage() {
        const defaultData = {
            totalVisitors: 0,
            todayVisitors: 0,
            monthlyVisitors: 0,
            totalPageViews: 0,
            newsViews: {},
            dailyStats: {},
            lastVisit: null,
            currentDate: new Date().toDateString(),
            monthlyDate: new Date().getMonth() + '-' + new Date().getFullYear(),
            sessions: [],
            topPages: {},
            deviceStats: {
                desktop: 0,
                mobile: 0,
                tablet: 0
            },
            browserStats: {},
            referrerStats: {},
            timeSpent: [],
            bounceRate: 0
        };

        // Initialize if not exists
        if (!localStorage.getItem('dodod_analytics')) {
            localStorage.setItem('dodod_analytics', JSON.stringify(defaultData));
        }

        // Reset daily stats if new day
        this.checkAndResetDaily();
        this.checkAndResetMonthly();
    }

    // Get analytics data
    getData() {
        return JSON.parse(localStorage.getItem('dodod_analytics') || '{}');
    }

    // Save analytics data
    saveData(data) {
        localStorage.setItem('dodod_analytics', JSON.stringify(data));
    }

    // Check if we need to reset daily stats
    checkAndResetDaily() {
        const data = this.getData();
        const today = new Date().toDateString();
        
        if (data.currentDate !== today) {
            // Save yesterday's stats to daily history
            data.dailyStats[data.currentDate] = {
                visitors: data.todayVisitors,
                pageViews: data.totalPageViews,
                date: data.currentDate
            };
            
            // Reset today's counters
            data.todayVisitors = 0;
            data.currentDate = today;
            this.saveData(data);
        }
    }

    // Check if we need to reset monthly stats
    checkAndResetMonthly() {
        const data = this.getData();
        const currentMonth = new Date().getMonth() + '-' + new Date().getFullYear();
        
        if (data.monthlyDate !== currentMonth) {
            data.monthlyVisitors = 0;
            data.monthlyDate = currentMonth;
            this.saveData(data);
        }
    }

    // Track a visit
    trackVisit() {
        const data = this.getData();
        const now = new Date();
        const sessionId = this.generateSessionId();
        
        // Check if this is a new visitor (not visited in last 30 minutes)
        const isNewVisitor = !data.lastVisit || 
            (now.getTime() - new Date(data.lastVisit).getTime()) > 30 * 60 * 1000;
        
        if (isNewVisitor) {
            data.totalVisitors++;
            data.todayVisitors++;
            data.monthlyVisitors++;
        }
        
        // Always count page view
        data.totalPageViews++;
        
        // Update last visit
        data.lastVisit = now.toISOString();
        
        // Track session
        data.sessions.push({
            id: sessionId,
            timestamp: now.toISOString(),
            page: window.location.pathname,
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent
        });
        
        // Keep only last 100 sessions
        if (data.sessions.length > 100) {
            data.sessions = data.sessions.slice(-100);
        }
        
        // Track device type
        this.trackDevice(data);
        
        // Track browser
        this.trackBrowser(data);
        
        // Track page
        this.trackPage(data);
        
        // Track referrer
        this.trackReferrer(data);
        
        this.saveData(data);
    }

    // Generate unique session ID
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Track device type
    trackDevice(data) {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (/mobile|android|iphone/.test(userAgent)) {
            data.deviceStats.mobile++;
        } else if (/ipad|tablet/.test(userAgent)) {
            data.deviceStats.tablet++;
        } else {
            data.deviceStats.desktop++;
        }
    }

    // Track browser
    trackBrowser(data) {
        const userAgent = navigator.userAgent;
        let browser = 'Other';
        
        if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Edge')) browser = 'Edge';
        
        data.browserStats[browser] = (data.browserStats[browser] || 0) + 1;
    }

    // Track page visits
    trackPage(data) {
        const page = window.location.pathname || 'index.html';
        data.topPages[page] = (data.topPages[page] || 0) + 1;
    }

    // Track referrer
    trackReferrer(data) {
        const referrer = document.referrer || 'direct';
        const domain = referrer ? new URL(referrer).hostname : 'direct';
        data.referrerStats[domain] = (data.referrerStats[domain] || 0) + 1;
    }

    // Track news article views
    trackNewsView(newsId, newsTitle) {
        const data = this.getData();
        
        if (!data.newsViews[newsId]) {
            data.newsViews[newsId] = {
                title: newsTitle,
                views: 0,
                lastViewed: null
            };
        }
        
        data.newsViews[newsId].views++;
        data.newsViews[newsId].lastViewed = new Date().toISOString();
        
        this.saveData(data);
        this.updateDisplays();
    }

    // Get top news articles
    getTopNews(limit = 5) {
        const data = this.getData();
        return Object.entries(data.newsViews)
            .sort(([,a], [,b]) => b.views - a.views)
            .slice(0, limit)
            .map(([id, info]) => ({ id, ...info }));
    }

    // Update displays on page
    updateDisplays() {
        const data = this.getData();
        
        // Update admin dashboard if elements exist
        this.updateElement('totalNews', Object.keys(data.newsViews).length);
        this.updateElement('todayVisitors', data.todayVisitors);
        this.updateElement('monthlyVisitors', data.monthlyVisitors);
        this.updateElement('pendingNews', 3); // Static for now
        
        // Update homepage stats if elements exist
        this.updateElement('stats-total-visitors', data.totalVisitors);
        this.updateElement('stats-today-visitors', data.todayVisitors);
        this.updateElement('stats-page-views', data.totalPageViews);
        this.updateElement('stats-news-count', Object.keys(data.newsViews).length);
        
        // Update news view counts
        this.updateNewsViewCounts();
    }

    // Helper to update element if it exists
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = this.formatNumber(value);
        }
    }

    // Update news view counts on page
    updateNewsViewCounts() {
        const data = this.getData();
        const viewElements = document.querySelectorAll('.news-view-count');
        
        viewElements.forEach(element => {
            const newsId = element.getAttribute('data-news-id');
            if (newsId && data.newsViews[newsId]) {
                element.textContent = this.formatNumber(data.newsViews[newsId].views);
            }
        });
    }

    // Format numbers (e.g., 1000 -> 1K)
    formatNumber(num) {
        if (num >= 1000000) {
            return Math.floor(num / 1000000) + 'M';
        } else if (num >= 1000) {
            return Math.floor(num / 1000) + 'K';
        }
        return num.toString();
    }

    // Start real-time updates
    startRealTimeUpdates() {
        // Update displays every 30 seconds
        setInterval(() => {
            this.updateDisplays();
        }, 30000);
        
        // Track time spent on page
        this.trackTimeSpent();
    }

    // Track time spent on page
    trackTimeSpent() {
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - startTime;
            const data = this.getData();
            
            data.timeSpent.push({
                page: window.location.pathname,
                duration: timeSpent,
                timestamp: new Date().toISOString()
            });
            
            // Keep only last 50 time records
            if (data.timeSpent.length > 50) {
                data.timeSpent = data.timeSpent.slice(-50);
            }
            
            this.saveData(data);
        });
    }

    // Get analytics summary
    getAnalyticsSummary() {
        const data = this.getData();
        
        return {
            visitors: {
                total: data.totalVisitors,
                today: data.todayVisitors,
                monthly: data.monthlyVisitors
            },
            pageViews: data.totalPageViews,
            topNews: this.getTopNews(),
            deviceBreakdown: data.deviceStats,
            browserBreakdown: data.browserStats,
            topPages: Object.entries(data.topPages)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5),
            averageTimeSpent: this.calculateAverageTimeSpent(),
            recentSessions: data.sessions.slice(-10).reverse()
        };
    }

    // Calculate average time spent
    calculateAverageTimeSpent() {
        const data = this.getData();
        if (data.timeSpent.length === 0) return 0;
        
        const total = data.timeSpent.reduce((sum, record) => sum + record.duration, 0);
        return Math.round(total / data.timeSpent.length / 1000); // in seconds
    }

    // Export data (for backup/analysis)
    exportData() {
        const data = this.getData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `dodod-analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Reset all data (admin function)
    resetData() {
        if (confirm('Apakah Anda yakin ingin mereset semua data analytics? Tindakan ini tidak dapat dibatalkan.')) {
            localStorage.removeItem('dodod_analytics');
            this.initializeStorage();
            this.updateDisplays();
            alert('Data analytics telah direset.');
        }
    }

    // Clear all data (for admin)
    clearAllData() {
        localStorage.removeItem('dodod_analytics');
        this.initializeStorage();
        this.updateDisplays();
    }

    // Add test data for demonstration
    addTestData() {
        const data = this.getData();
        
        // Add random visitors data
        data.totalVisitors += Math.floor(Math.random() * 500) + 200;
        data.todayVisitors += Math.floor(Math.random() * 100) + 50;
        data.monthlyVisitors += Math.floor(Math.random() * 1000) + 500;
        data.totalPageViews += Math.floor(Math.random() * 2000) + 1000;
        
        // Add device stats
        data.deviceStats.desktop += Math.floor(Math.random() * 300) + 100;
        data.deviceStats.mobile += Math.floor(Math.random() * 400) + 200;
        data.deviceStats.tablet += Math.floor(Math.random() * 100) + 30;
        
        // Add browser stats
        data.browserStats.Chrome = (data.browserStats.Chrome || 0) + Math.floor(Math.random() * 200) + 100;
        data.browserStats.Firefox = (data.browserStats.Firefox || 0) + Math.floor(Math.random() * 100) + 50;
        data.browserStats.Safari = (data.browserStats.Safari || 0) + Math.floor(Math.random() * 80) + 30;
        data.browserStats.Edge = (data.browserStats.Edge || 0) + Math.floor(Math.random() * 60) + 20;
        
        // Add top pages
        const pages = ['index.html', 'semua-berita.html', 'detail-berita.html'];
        pages.forEach(page => {
            data.topPages[page] = (data.topPages[page] || 0) + Math.floor(Math.random() * 100) + 50;
        });
        
        // Add test news views
        const testNews = [
            'Pembangunan Infrastruktur Baru di Saketi',
            'Festival Budaya Saketi 2025',
            'Program Kesehatan Gratis',
            'Perbaikan Jalan Raya Utama',
            'Peluncuran Program Bantuan UMKM'
        ];
        
        testNews.forEach((title, index) => {
            const id = 'news_test_' + (index + 1);
            data.newsViews[id] = {
                title: title,
                views: Math.floor(Math.random() * 500) + 100,
                lastViewed: new Date().toISOString()
            };
        });
        
        // Add recent sessions
        for (let i = 0; i < 10; i++) {
            const session = {
                timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                page: pages[Math.floor(Math.random() * pages.length)],
                referrer: ['Direct', 'Google', 'Facebook', 'Twitter'][Math.floor(Math.random() * 4)],
                duration: Math.floor(Math.random() * 300) + 30
            };
            data.sessions.push(session);
        }
        
        this.saveData(data);
        this.updateDisplays();
        
        return data;
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create global analytics instance
    window.dododAnalytics = new DododAnalytics();
    
    // Track news views when news links are clicked
    document.querySelectorAll('a[href*="detail-berita"]').forEach(link => {
        link.addEventListener('click', function() {
            const newsTitle = this.closest('.card')?.querySelector('.card-title')?.textContent || 'Unknown News';
            const newsId = 'news_' + Date.now();
            window.dododAnalytics.trackNewsView(newsId, newsTitle);
        });
    });
});

// Expose some functions globally for admin use
window.exportAnalytics = function() {
    window.dododAnalytics.exportData();
};

window.resetAnalytics = function() {
    window.dododAnalytics.resetData();
};

window.addTestData = function() {
    window.dododAnalytics.addTestData();
};

window.getAnalyticsSummary = function() {
    return window.dododAnalytics.getAnalyticsSummary();
};
