import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { subDays } from 'date-fns';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const range = searchParams.get('range') || '7d';
  const type = searchParams.get('type') || 'device'; // device, browser, os
  const siteId = searchParams.get('siteId');

  let startDate = subDays(new Date(), 7);
  if (range === '30d') startDate = subDays(new Date(), 30);
  if (range === '90d') startDate = subDays(new Date(), 90);

  const supabase = await createClient();

  try {
    // Map type to column name
    let column = 'device_type';
    if (type === 'browser') column = 'browser';
    if (type === 'os') column = 'os';

    let query = supabase
      .from('page_views')
      .select(column)
      .gte('timestamp', startDate.toISOString());

    if (siteId) query = query.eq('site_id', siteId);

    const { data, error } = await query;

    if (error) throw error;

    const countMap = new Map<string, number>();

    data?.forEach((pv: any) => {
      const key = pv[column] || 'Unknown';
      countMap.set(key, (countMap.get(key) || 0) + 1);
    });

    const total = data?.length || 0;
    const result = Array.from(countMap.entries())
      .map(([name, value]) => ({
        name,
        value: total > 0 ? Math.round((value / total) * 100) : 0,
        count: value // Also return absolute count
      }))
      .sort((a, b) => b.value - a.value);

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
