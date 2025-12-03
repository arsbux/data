import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { subDays } from 'date-fns';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const range = searchParams.get('range') || '7d';
  const siteId = searchParams.get('siteId');

  let startDate = subDays(new Date(), 7);
  if (range === '30d') startDate = subDays(new Date(), 30);

  const supabase = await createClient();

  try {
    let query = supabase
      .from('page_views')
      .select('path')
      .gte('timestamp', startDate.toISOString());

    if (siteId) query = query.eq('site_id', siteId);

    const { data, error } = await query;

    if (error) throw error;

    const pagesMap = new Map<string, number>();
    
    data?.forEach(pv => {
      const path = pv.path || '/';
      pagesMap.set(path, (pagesMap.get(path) || 0) + 1);
    });

    const result = Array.from(pagesMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
