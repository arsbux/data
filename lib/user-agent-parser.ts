export interface UserAgentInfo {
    browser: string;
    browserVersion: string;
    os: string;
    osVersion: string;
    device: 'mobile' | 'tablet' | 'desktop';
}

export function parseUserAgent(uaString: string): UserAgentInfo {
    const ua = uaString.toLowerCase();

    // Device detection
    let device: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        device = 'tablet';
    } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)os|Opera M(obi|ini)/.test(uaString)) {
        device = 'mobile';
    }

    // Browser detection
    let browser = 'Unknown';
    let browserVersion = '';

    if (ua.indexOf('firefox') > -1) {
        browser = 'Firefox';
        browserVersion = ua.match(/firefox\/([\d.]+)/)?.[1] || '';
    } else if (ua.indexOf('samsungbrowser') > -1) {
        browser = 'Samsung Internet';
        browserVersion = ua.match(/samsungbrowser\/([\d.]+)/)?.[1] || '';
    } else if (ua.indexOf('opera') > -1 || ua.indexOf('opr') > -1) {
        browser = 'Opera';
        browserVersion = ua.match(/(?:opera|opr)\/([\d.]+)/)?.[1] || '';
    } else if (ua.indexOf('trident') > -1) {
        browser = 'Internet Explorer';
        browserVersion = ua.match(/rv:([\d.]+)/)?.[1] || '';
    } else if (ua.indexOf('edge') > -1 || ua.indexOf('edg') > -1) {
        browser = 'Edge';
        browserVersion = ua.match(/(?:edge|edg)\/([\d.]+)/)?.[1] || '';
    } else if (ua.indexOf('chrome') > -1) {
        browser = 'Chrome';
        browserVersion = ua.match(/chrome\/([\d.]+)/)?.[1] || '';
    } else if (ua.indexOf('safari') > -1) {
        browser = 'Safari';
        browserVersion = ua.match(/version\/([\d.]+)/)?.[1] || '';
    }

    // OS detection
    let os = 'Unknown';
    let osVersion = '';

    if (ua.indexOf('windows') > -1) {
        os = 'Windows';
        // Simple version mapping could be added here
    } else if (ua.indexOf('android') > -1) {
        os = 'Android';
        osVersion = ua.match(/android ([\d.]+)/)?.[1] || '';
    } else if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('ipod') > -1) {
        os = 'iOS';
        osVersion = ua.match(/os ([\d_]+)/)?.[1]?.replace(/_/g, '.') || '';
    } else if (ua.indexOf('mac') > -1) {
        os = 'macOS';
        osVersion = ua.match(/mac os x ([\d_]+)/)?.[1]?.replace(/_/g, '.') || '';
    } else if (ua.indexOf('linux') > -1) {
        os = 'Linux';
    }

    return { browser, browserVersion, os, osVersion, device };
}
