'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';

interface DashboardStats {
  visitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionTime: number;
}

interface TimelineData {
  date: string;
  visitors: number;
}

interface ListItem {
  name: string;
  value: number;
  code?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    visitors: 0,
    pageViews: 0,
    bounceRate: 0,
    avgSessionTime: 0,
  });
  const [visitorsNow, setVisitorsNow] = useState(0);
  const [timeline, setTimeline] = useState<TimelineData[]>([]);
  const [referrers, setReferrers] = useState<ListItem[]>([]);
  const [pages, setPages] = useState<ListItem[]>([]);
  const [locations, setLocations] = useState<ListItem[]>([]);
  const [devices, setDevices] = useState<ListItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('24h');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          overviewRes,
          timelineRes,
          referrersRes,
          pagesRes,
          locationsRes,
          devicesRes
        ] = await Promise.all([
          fetch(`/api/analytics/overview?range=${range}`),
          fetch(`/api/analytics/timeline?range=${range}`),
          fetch(`/api/analytics/referrers?range=${range}`),
          fetch(`/api/analytics/pages?range=${range}`),
          fetch(`/api/analytics/locations?range=${range}`),
          fetch(`/api/analytics/devices?range=${range}`)
        ]);

        const overview = await overviewRes.json();
        const timelineData = await timelineRes.json();
        const referrersData = await referrersRes.json();
        const pagesData = await pagesRes.json();
        const locationsData = await locationsRes.json();
        const devicesData = await devicesRes.json();

        setStats(overview.error ? { visitors: 0, pageViews: 0, bounceRate: 0, avgSessionTime: 0 } : overview);
        setTimeline(Array.isArray(timelineData) ? timelineData : []);
        setReferrers(Array.isArray(referrersData) ? referrersData : []);
        setPages(Array.isArray(pagesData) ? pagesData : []);
        setLocations(Array.isArray(locationsData) ? locationsData : []);
        setDevices(Array.isArray(devicesData) ? devicesData : []);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range]);

  // Live visitor polling
  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch('/api/analytics/live');
        const data = await res.json();
        setVisitorsNow(data.visitorsNow);
      } catch (error) {
        console.error('Failed to fetch live stats', error);
      }
    };

    fetchLive();
    const interval = setInterval(fetchLive, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}m ${secs}s`;
  };

  if (loading && !stats.visitors) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Dashboard</h1>
        </div>
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Dashboard</h1>

      </div>

      <div className={styles.chartSection}>
        <AnalyticsChart
          stats={stats}
          visitorsNow={visitorsNow}
          data={timeline}
          range={range}
          onRangeChange={setRange}
        />
      </div>

      <div className={styles.dataGrid}>
        <DataCard title="Top Referrers" data={referrers} />
        <DataCard title="Top Pages" data={pages} />
        <DataCard title="Top Locations" data={locations} type="country" />
        <DataCard title="Devices" data={devices} type="device" />
      </div>
    </div>
  );
}

function DataCard({ title, data, type }: { title: string, data: ListItem[], type?: 'country' | 'device' }) {
  const maxValue = Math.max(...data.map(d => d.value), 0);

  return (
    <div className="glass-card">
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.dataList}>
        {data.length === 0 && <div className={styles.emptyState}>No data yet</div>}
        {data.map((item, i) => {
          const percent = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          return (
            <div key={i} className={styles.dataItem}>
              <div
                className={styles.dataBar}
                style={{ width: `${percent}%` }}
              />
              <div className={styles.dataContent}>
                <span className={styles.dataLabel}>
                  {type === 'country' && item.code ? `${getFlagEmoji(item.code)} ` : ''}
                  {item.name}
                </span>
                <span className={styles.dataValue}>
                  {item.value}{type === 'device' ? '%' : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
