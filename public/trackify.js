; (function (window, document) {
    'use strict';

    // Determine API endpoint from script src
    const script = document.querySelector('script[data-site-id]');
    const scriptSrc = script ? script.src : '';
    const apiBase = scriptSrc ? new URL(scriptSrc).origin : window.location.origin;

    const CONFIG = {
        apiEndpoint: `${apiBase}/api/ingest`,
        autoTrack: true,
    };

    // Helper to generate UUIDs
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Helper to get or create persistent ID
    function getOrCreatePersistentId(key) {
        let id = localStorage.getItem(key);
        if (!id) {
            id = generateUUID();
            localStorage.setItem(key, id);
        }
        return id;
    }

    // Session management
    const SESSION_KEY = 'trackify_session';
    const VISITOR_KEY = 'trackify_visitor';
    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

    function getSession() {
        const now = Date.now();
        let session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');

        if (!session || now - session.lastActive > SESSION_DURATION) {
            // New session
            session = {
                id: generateUUID(),
                startTime: now,
                lastActive: now
            };
        } else {
            session.lastActive = now;
        }

        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
    }

    // Main tracking function
    async function trackPageView() {
        const session = getSession();
        const visitorId = getOrCreatePersistentId(VISITOR_KEY);
        const script = document.querySelector('script[data-site-id]');
        const siteId = script ? script.getAttribute('data-site-id') : null;

        if (!siteId) {
            console.warn('Trackify: No data-site-id found');
            return;
        }

        const payload = {
            type: 'pageview',
            siteId: siteId,
            visitorId: visitorId,
            sessionId: session.id,
            sessionStartTime: session.startTime,
            url: window.location.href,
            path: window.location.pathname,
            referrer: document.referrer,
            title: document.title,
            width: window.screen.width,
            height: window.screen.height,
            language: navigator.language,
            userAgent: navigator.userAgent,
        };

        try {
            // Use sendBeacon if available for better reliability on unload
            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
                navigator.sendBeacon(CONFIG.apiEndpoint, blob);
            } else {
                await fetch(CONFIG.apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                    keepalive: true,
                });
            }
        } catch (error) {
            console.error('Trackify: Failed to send event', error);
        }
    }

    // SPA handling
    function handleHistoryChange(type) {
        const original = history[type];
        return function () {
            const result = original.apply(this, arguments);
            trackPageView();
            return result;
        };
    }

    // Initialize
    function init() {
        if (CONFIG.autoTrack) {
            // Initial page load
            trackPageView();

            // History API (SPA)
            history.pushState = handleHistoryChange('pushState');
            history.replaceState = handleHistoryChange('replaceState');

            // Popstate (Back/Forward)
            window.addEventListener('popstate', () => trackPageView());
        }
    }

    // Expose global API
    window.trackify = {
        track: trackPageView,
        init: init
    };

    // Auto-init
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }

})(window, document);
