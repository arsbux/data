import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { startOfDay, subDays } from 'date-fns';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const range = searchParams.get('range') || '7d';
  const siteId = searchParams.get('siteId'); // Optional: filter by site

  let startDate = new Date();
  if (range === '30d') {
    startDate = subDays(new Date(), 30);
  } else if (range === '90d') {
    startDate = subDays(new Date(), 90);
  } else {
    startDate = subDays(new Date(), 7);
  }

  const supabase = await createClient();

  try {
    // 1. Page Views
    let query = supabase
      .from('page_views')
      .select('id', { count: 'exact' })
      .gte('timestamp', startDate.toISOString());
    
    if (siteId) query = query.eq('site_id', siteId);
    
    const { count: pageViews, error: pvError } = await query;
    
    if (pvError) throw pvError;

    // 2. Visitors (Unique)
    // Supabase doesn't support distinct count easily in one go without RPC or raw SQL for simple clients, 
    // but we can approximate or use a separate query. 
    // For now, let's use a simplified approach or assume we have a 'sessions' table that is populated.
    // The implementation plan mentioned a 'sessions' table.
    
    let sessionsQuery = supabase
      .from('sessions')
      .select('visitor_id, duration, page_views, bounced')
      .gte('started_at', startDate.toISOString());

    if (siteId) sessionsQuery = sessionsQuery.eq('site_id', siteId);

    const { data: sessions, error: sessionsError } = await sessionsQuery;

    if (sessionsError) throw sessionsError;

    const uniqueVisitors = new Set(sessions?.map(s => s.visitor_id)).size;
    const totalSessions = sessions?.length || 0;
    const bouncedSessions = sessions?.filter(s => s.page_views === 1).length || 0;
    const totalDuration = sessions?.reduce((acc, s) => acc + (s.duration || 0), 0) || 0;

    const bounceRate = totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0;
    const avgSessionTime = totalSessions > 0 ? totalDuration / totalSessions : 0;

    return NextResponse.json({
      visitors: uniqueVisitors,
      pageViews: pageViews || 0,
      bounceRate: Math.round(bounceRate * 10) / 10,
      avgSessionTime: Math.round(avgSessionTime),
    });

  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
