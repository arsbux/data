import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { subDays } from 'date-fns';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const range = searchParams.get('range') || '7d';
  const type = searchParams.get('type') || 'country'; // country, region, city
  const siteId = searchParams.get('siteId');

  let startDate = subDays(new Date(), 7);
  if (range === '30d') startDate = subDays(new Date(), 30);
  if (range === '90d') startDate = subDays(new Date(), 90);

  const supabase = await createClient();

  try {
    let column = 'country';
    if (type === 'region') column = 'region';
    if (type === 'city') column = 'city';

    let query = supabase
      .from('page_views')
      .select(`${column}, country_code`) // Always fetch country_code for flags if available
      .gte('timestamp', startDate.toISOString());

    if (siteId) query = query.eq('site_id', siteId);

    const { data, error } = await query;

    if (error) throw error;

    const locationMap = new Map<string, number>();
    const codeMap = new Map<string, string>();

    data?.forEach((pv: any) => {
      const name = pv[column] || 'Unknown';
      locationMap.set(name, (locationMap.get(name) || 0) + 1);
      if (pv.country_code) codeMap.set(name, pv.country_code);
    });

    const result = Array.from(locationMap.entries())
      .map(([name, value]) => ({
        name,
        value,
        code: codeMap.get(name) // This might be inaccurate for city/region if names duplicate across countries, but acceptable for now
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 20); // Increased limit

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
