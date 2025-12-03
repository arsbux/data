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
      .select('device_type')
      .gte('timestamp', startDate.toISOString());

    if (siteId) query = query.eq('site_id', siteId);

    const { data, error } = await query;

    if (error) throw error;

    const deviceMap = new Map<string, number>();
    
    data?.forEach(pv => {
      const device = pv.device_type || 'desktop'; // Default to desktop if unknown
      deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
    });

    const total = data?.length || 0;
    const result = Array.from(deviceMap.entries())
      .map(([name, value]) => ({ 
        name, 
        value: total > 0 ? Math.round((value / total) * 100) : 0
      }))
      .sort((a, b) => b.value - a.value);

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
