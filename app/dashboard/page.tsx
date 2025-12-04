'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { Plus, Copy, Check, Loader2, Globe, Zap } from 'lucide-react';

interface Site {
  id: string;
  site_id: string;
  domain: string;
  name: string;
}

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
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
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
  const [loadingSites, setLoadingSites] = useState(true);
  const [range, setRange] = useState('24h');
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch sites
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await fetch('/api/sites');
        const data = await res.json();
        setSites(Array.isArray(data) ? data : []);
        // Select first site by default
        if (Array.isArray(data) && data.length > 0) {
          setSelectedSiteId(data[0].site_id);
        }
      } catch (error) {
        console.error('Failed to fetch sites', error);
      } finally {
        setLoadingSites(false);
      }
    };
    fetchSites();
  }, []);

  // Fetch analytics data
  useEffect(() => {
    if (!selectedSiteId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = `?range=${range}&siteId=${selectedSiteId}`;
        const [
          overviewRes,
          timelineRes,
          referrersRes,
          pagesRes,
          locationsRes,
          devicesRes
        ] = await Promise.all([
          fetch(`/api/analytics/overview${queryParams}`),
          fetch(`/api/analytics/timeline${queryParams}`),
          fetch(`/api/analytics/referrers${queryParams}`),
          fetch(`/api/analytics/pages${queryParams}`),
          fetch(`/api/analytics/locations${queryParams}`),
          fetch(`/api/analytics/devices${queryParams}`)
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
  }, [range, selectedSiteId]);

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

  const selectedSite = sites.find(s => s.site_id === selectedSiteId);
  const hasData = stats.pageViews > 0 || timeline.some(t => t.visitors > 0);

  const handleCopyCode = () => {
    if (selectedSite) {
      const code = `<script defer src="https://data.flightlabs.agency/trackify.js" data-site-id="${selectedSite.site_id}"></script>`;
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Loading state
  if (loadingSites) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Dashboard</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          Loading...
        </div>
      </div>
    );
  }

  // No sites added - show add site prompt
  if (sites.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Dashboard</h1>
        </div>

        <NoSitesPopup onAddSite={() => router.push('/dashboard/add-site')} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
      </div>

      {/* Waiting for first event popup */}
      {!hasData && !loading && selectedSite && (
        <WaitingForDataPopup
          site={selectedSite}
          onCopy={handleCopyCode}
          copied={copied}
        />
      )}

      <div className={styles.chartSection}>
        <AnalyticsChart
          stats={stats}
          visitorsNow={visitorsNow}
          data={timeline}
          range={range}
          onRangeChange={setRange}
          selectedSiteId={selectedSiteId}
          onSiteChange={setSelectedSiteId}
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

// No sites popup component
function NoSitesPopup({ onAddSite }: { onAddSite: () => void }) {
  return (
    <div style={{
      maxWidth: '500px',
      margin: '4rem auto',
      padding: '3rem',
      background: 'linear-gradient(to bottom, rgba(30,41,59,0.5), rgba(15,23,42,0.5))',
      borderRadius: '24px',
      border: '1px solid rgba(255,255,255,0.1)',
      textAlign: 'center'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem'
      }}>
        <Globe size={40} color="white" />
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
        Add Your First Website
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
        Get started by adding a website to track. You'll receive a simple code snippet to add to your site.
      </p>

      <button
        onClick={onAddSite}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.875rem 2rem',
          background: 'var(--accent-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        <Plus size={20} />
        Add Website
      </button>
    </div>
  );
}

// Waiting for data popup component
function WaitingForDataPopup({ site, onCopy, copied }: { site: Site; onCopy: () => void; copied: boolean }) {
  return (
    <div style={{
      background: 'linear-gradient(to right, rgba(59,130,246,0.1), rgba(147,51,234,0.1))',
      borderRadius: '16px',
      border: '1px solid rgba(59,130,246,0.3)',
      padding: '1.5rem',
      marginBottom: '2rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'rgba(59,130,246,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Zap size={24} color="#60a5fa" style={{ animation: 'pulse 2s infinite' }} />
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Waiting for first event...
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Add the tracking code to <strong style={{ color: '#60a5fa' }}>{site.domain}</strong> to start receiving data.
          </p>

          <div style={{
            background: '#0d1117',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontFamily: 'ui-monospace, Menlo, Monaco, monospace',
            fontSize: '0.75rem',
            marginBottom: '1rem',
            overflow: 'auto',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <code style={{ color: '#c9d1d9' }}>
              {'<script defer src="https://data.flightlabs.agency/trackify.js" data-site-id="' + site.site_id + '"></script>'}
            </code>
          </div>

          <button
            onClick={onCopy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: copied ? '#22c55e' : 'var(--accent-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
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
