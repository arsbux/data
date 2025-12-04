import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { startOfDay, subDays, startOfHour, addHours, format, endOfDay } from 'date-fns';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const range = searchParams.get('range') || '24h';
  const siteId = searchParams.get('siteId');

  let startDate = new Date();
  let endDate = new Date();
  let intervalUnit = 'day';

  if (range === '24h') {
    // Start from midnight of the current day to the end of the current day
    startDate = startOfDay(new Date());
    endDate = endOfDay(new Date());
    intervalUnit = 'hour';
  } else if (range === '7d') {
    startDate = subDays(new Date(), 7);
    intervalUnit = 'day';
  } else if (range === '30d') {
    startDate = subDays(new Date(), 30);
    intervalUnit = 'day';
  } else if (range === '90d') {
    startDate = subDays(new Date(), 90);
    intervalUnit = 'day';
  }

  const supabase = await createClient();

  try {
    let query = supabase
      .from('page_views')
      .select('timestamp')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString())
      .order('timestamp', { ascending: true });

    if (siteId) query = query.eq('site_id', siteId);

    const { data, error } = await query;

    if (error) throw error;

    // Aggregate
    const timelineMap = new Map<string, number>();

    data?.forEach(pv => {
      const date = new Date(pv.timestamp);
      let key;
      if (intervalUnit === 'hour') {
        key = startOfHour(date).toISOString();
      } else {
        key = startOfDay(date).toISOString();
      }
      timelineMap.set(key, (timelineMap.get(key) || 0) + 1);
    });

    // Fill gaps
    const result = [];

    if (intervalUnit === 'hour') {
      let current = startOfHour(startDate);
      // We want to show the full 24h day, or at least up to the current hour if we want it "live"
      // The user asked for "starting from midnight, to the current hour... live"
      // But the image shows a full axis. Let's stick to "midnight to now" for data, but maybe the axis can handle the rest.
      // Actually, for a nice chart, filling up to the current hour is best.
      const end = startOfHour(new Date());

      while (current <= end) {
        const key = current.toISOString();
        result.push({
          date: key,
          visitors: timelineMap.get(key) || 0
        });
        current = addHours(current, 1);
      }
    } else {
      let current = startOfDay(startDate);
      const end = startOfDay(new Date()); // Up to today

      while (current <= end) {
        const key = current.toISOString();
        result.push({
          date: key,
          visitors: timelineMap.get(key) || 0
        });
        // Add 1 day
        current = new Date(current.setDate(current.getDate() + 1));
      }
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Timeline error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
