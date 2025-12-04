import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { subDays } from 'date-fns';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const range = searchParams.get('range') || '7d';
  const type = searchParams.get('type') || 'page'; // page, hostname, entry_page, exit_page
  const siteId = searchParams.get('siteId');

  let startDate = subDays(new Date(), 7);
  if (range === '30d') startDate = subDays(new Date(), 30);
  if (range === '90d') startDate = subDays(new Date(), 90);

  const supabase = await createClient();

  try {
    let data: any[] | null = [];

    if (type === 'entry_page' || type === 'exit_page') {
      let column = type === 'entry_page' ? 'entry_url' : 'exit_url';
      let query = supabase
        .from('sessions')
        .select(column)
        .gte('started_at', startDate.toISOString());

      if (siteId) query = query.eq('site_id', siteId);

      const { data: sessions, error } = await query;
      if (error) throw error;

      // Map sessions to a format similar to page_views for processing
      data = sessions?.map((s: any) => ({ path: s[column] })) || [];
    } else {
      let query = supabase
        .from('page_views')
        .select('path, url')
        .gte('timestamp', startDate.toISOString());

      if (siteId) query = query.eq('site_id', siteId);

      const { data: pvs, error } = await query;
      if (error) throw error;
      data = pvs;
    }

    const pagesMap = new Map<string, number>();

    data?.forEach((item: any) => {
      let key = item.path;

      if (type === 'hostname') {
        try {
          key = new URL(item.url).hostname;
        } catch {
          key = 'Unknown';
        }
      } else if (type === 'entry_page' || type === 'exit_page') {
        // Try to extract path from URL if it's a full URL
        try {
          if (key && key.startsWith('http')) {
            key = new URL(key).pathname;
          }
        } catch { }
      }

      key = key || '/';
      pagesMap.set(key, (pagesMap.get(key) || 0) + 1);
    });

    const result = Array.from(pagesMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 20);

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
