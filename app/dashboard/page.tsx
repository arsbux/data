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
  const [range, setRange] = useState('7d');

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

        setStats(overview);
        setTimeline(timelineData);
        setReferrers(referrersData);
        setPages(pagesData);
        setLocations(locationsData);
        setDevices(devicesData);
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
        <div className="glass-card">
          <h3 className={styles.cardTitle}>Top Referrers</h3>
          <div className={styles.dataList}>
            {referrers.length === 0 && <div className={styles.emptyState}>No data yet</div>}
            {referrers.map((item, i) => (
              <div key={i} className={styles.dataItem}>
                <span className={styles.dataLabel}>{item.name}</span>
                <span className={styles.dataValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <h3 className={styles.cardTitle}>Top Pages</h3>
          <div className={styles.dataList}>
            {pages.length === 0 && <div className={styles.emptyState}>No data yet</div>}
            {pages.map((item, i) => (
              <div key={i} className={styles.dataItem}>
                <span className={styles.dataLabel}>{item.name}</span>
                <span className={styles.dataValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <h3 className={styles.cardTitle}>Top Locations</h3>
          <div className={styles.dataList}>
            {locations.length === 0 && <div className={styles.emptyState}>No data yet</div>}
            {locations.map((item, i) => (
              <div key={i} className={styles.dataItem}>
                <span className={styles.dataLabel}>
                  {item.code ? `${getFlagEmoji(item.code)} ` : ''}{item.name}
                </span>
                <span className={styles.dataValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <h3 className={styles.cardTitle}>Devices</h3>
          <div className={styles.dataList}>
            {devices.length === 0 && <div className={styles.emptyState}>No data yet</div>}
            {devices.map((item, i) => (
              <div key={i} className={styles.dataItem}>
                <span className={styles.dataLabel} style={{ textTransform: 'capitalize' }}>{item.name}</span>
                <span className={styles.dataValue}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
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
