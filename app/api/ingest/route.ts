import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { parseUserAgent } from '@/lib/user-agent-parser';
import { getGeolocation } from '@/lib/geolocation';
import { createClient } from '@/lib/supabase/server';

const PageViewSchema = z.object({
    type: z.literal('pageview'),
    siteId: z.string(),
    visitorId: z.string().uuid(),
    sessionId: z.string().uuid(),
    sessionStartTime: z.number().optional(),
    url: z.string().url(),
    path: z.string(),
    referrer: z.string().optional(),
    title: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    language: z.string().optional(),
    userAgent: z.string(),
});

export async function POST(request: NextRequest) {
    try {
        // Parse and validate request body
        const body = await request.json();
        const validated = PageViewSchema.parse(body);

        // Get IP address
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            '127.0.0.1';

        // Parse user agent
        const uaInfo = parseUserAgent(validated.userAgent);

        // Get geolocation
        const geoData = await getGeolocation(ip);

        // Extract referrer domain
        let referrerDomain = null;
        if (validated.referrer) {
            try {
                const url = new URL(validated.referrer);
                referrerDomain = url.hostname;
            } catch {
                // Invalid URL
            }
        }

        // Get Supabase client
        const supabase = await createClient();

        // 1. Insert page view
        const { error: pageViewError } = await supabase
            .from('page_views')
            .insert({
                site_id: validated.siteId,
                visitor_id: validated.visitorId,
                session_id: validated.sessionId,
                url: validated.url,
                path: validated.path,
                title: validated.title,
                referrer: validated.referrer,
                referrer_domain: referrerDomain,
                browser: uaInfo.browser,
                browser_version: uaInfo.browserVersion,
                os: uaInfo.os,
                os_version: uaInfo.osVersion,
                device_type: uaInfo.device,
                screen_width: validated.width,
                screen_height: validated.height,
                country: geoData.country,
                country_code: geoData.countryCode,
                region: geoData.region,
                city: geoData.city,
                latitude: geoData.latitude,
                longitude: geoData.longitude,
            });

        if (pageViewError) {
            console.error('Failed to insert page view:', pageViewError);
            return NextResponse.json({ error: 'Failed to track page view' }, { status: 500 });
        }

        // 2. Handle Session (Select -> Calculate -> Upsert)
        const now = new Date();
        const startTime = validated.sessionStartTime ? new Date(validated.sessionStartTime) : now;

        // Fetch existing session
        const { data: existingSession } = await supabase
            .from('sessions')
            .select('page_views, id')
            .eq('site_id', validated.siteId)
            .eq('session_id', validated.sessionId)
            .single();

        const pageViews = (existingSession?.page_views || 0) + 1;
        const duration = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        const bounced = pageViews === 1; // Simplistic bounce rate definition (only 1 page view)

        const { error: sessionError } = await supabase
            .from('sessions')
            .upsert({
                site_id: validated.siteId,
                visitor_id: validated.visitorId,
                session_id: validated.sessionId,
                started_at: startTime.toISOString(),
                ended_at: now.toISOString(),
                duration: duration,
                page_views: pageViews,
                bounced: bounced,
                // Only set these on creation (if not exists) - but upsert overwrites. 
                // We'll just overwrite them with the current values which is fine for "last seen" or "first seen" logic
                // Ideally we'd only set entry_url if it's a new session.
                entry_url: existingSession ? undefined : validated.url,
                entry_referrer: existingSession ? undefined : validated.referrer,
                country_code: geoData.countryCode,
                city: geoData.city,
                device_type: uaInfo.device,
                browser: uaInfo.browser,
                os: uaInfo.os,
            }, {
                onConflict: 'site_id,session_id'
            });

        if (sessionError) {
            console.error('Failed to update session:', sessionError);
        }

        // 3. Upsert active visitor
        const { error: activeVisitorError } = await supabase
            .from('active_visitors')
            .upsert({
                site_id: validated.siteId,
                visitor_id: validated.visitorId,
                session_id: validated.sessionId,
                last_seen: now.toISOString(),
                current_page: validated.path,
                country_code: geoData.countryCode,
                city: geoData.city,
                latitude: geoData.latitude,
                longitude: geoData.longitude,
            }, {
                onConflict: 'site_id,visitor_id'
            });

        if (activeVisitorError) {
            console.error('Failed to update active visitor:', activeVisitorError);
        }

        const origin = request.headers.get('origin') || '*';

        return NextResponse.json({ success: true }, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Credentials': 'true',
            }
        });
    } catch (error) {
        console.error('Ingestion error:', error);
        const origin = request.headers.get('origin') || '*';

        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid request data', details: (error as any).errors }, {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': origin,
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Credentials': 'true',
                }
            });
        }

        return NextResponse.json({ error: 'Internal server error' }, {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Credentials': 'true',
            }
        });
    }
}

export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin') || '*';

    return NextResponse.json({}, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Credentials': 'true',
        }
    });
}
