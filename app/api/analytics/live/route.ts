import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { subMinutes } from 'date-fns';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const siteId = searchParams.get('siteId');

  const supabase = await createClient();
  const fiveMinutesAgo = subMinutes(new Date(), 5).toISOString();

  try {
    let query = supabase
      .from('active_visitors')
      .select('visitor_id', { count: 'exact' })
      .gte('last_seen', fiveMinutesAgo);

    if (siteId) query = query.eq('site_id', siteId);

    const { count, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      visitorsNow: count || 0
    });

  } catch (error: any) {
    console.error('Live analytics error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
