export interface GeoData {
    country?: string;
    countryCode?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
}

export async function getGeolocation(ip: string): Promise<GeoData> {
    // In a real production environment, you would use a service like MaxMind, ipapi, or Vercel's headers.
    // For this implementation, we'll try to use Vercel's headers in the API route, 
    // but if we need to fetch from an IP, we'd use an external service.

    // Mock response for local development or if IP is localhost
    if (ip === '127.0.0.1' || ip === '::1') {
        return {
            country: 'Localhost',
            countryCode: 'LO',
            region: 'Local',
            city: 'Local',
            latitude: 0,
            longitude: 0
        };
    }

    try {
        // Example using a free API (rate limited) - strictly for demo purposes
        // In production, rely on headers or a paid DB
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        const data = await response.json();

        if (data.status === 'success') {
            return {
                country: data.country,
                countryCode: data.countryCode,
                region: data.regionName,
                city: data.city,
                latitude: data.lat,
                longitude: data.lon
            };
        }
    } catch (error) {
        console.error('Geo lookup failed', error);
    }

    return {};
}
