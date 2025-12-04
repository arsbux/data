import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { subDays } from 'date-fns';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const range = searchParams.get('range') || '7d';
  const type = searchParams.get('type') || 'referrer'; // referrer, channel, campaign, keyword
  const siteId = searchParams.get('siteId');

  let startDate = subDays(new Date(), 7);
  if (range === '30d') startDate = subDays(new Date(), 30);
  if (range === '90d') startDate = subDays(new Date(), 90);

  const supabase = await createClient();

  try {
    let column = 'referrer_domain';
    if (type === 'channel') column = 'utm_medium'; // or utm_source
    if (type === 'campaign') column = 'utm_campaign';
    if (type === 'keyword') column = 'utm_term';

    let query = supabase
      .from('page_views')
      .select(column)
      .gte('timestamp', startDate.toISOString());

    if (siteId) query = query.eq('site_id', siteId);

    const { data, error } = await query;

    if (error) throw error;

    const referrersMap = new Map<string, number>();

    data?.forEach((pv: any) => {
      const name = pv[column] || (type === 'referrer' ? 'Direct / None' : 'None');
      referrersMap.set(name, (referrersMap.get(name) || 0) + 1);
    });

    const result = Array.from(referrersMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 20);

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
