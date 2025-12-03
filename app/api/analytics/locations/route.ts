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
      .select('country, country_code')
      .gte('timestamp', startDate.toISOString());

    if (siteId) query = query.eq('site_id', siteId);

    const { data, error } = await query;

    if (error) throw error;

    const locationMap = new Map<string, number>();
    const codeMap = new Map<string, string>();
    
    data?.forEach(pv => {
      const country = pv.country || 'Unknown';
      locationMap.set(country, (locationMap.get(country) || 0) + 1);
      if (pv.country_code) codeMap.set(country, pv.country_code);
    });

    const result = Array.from(locationMap.entries())
      .map(([name, value]) => ({ 
        name, 
        value,
        code: codeMap.get(name)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
