'use client';
import Link from "next/link";
import dynamic from 'next/dynamic';
import { ArrowRight, Check, Zap, Globe, Shield, Users, BarChart3, MapPin, Monitor, TrendingUp, Link as LinkIcon, FileText, Radio } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

// Dynamically import Globe to avoid SSR issues
const GlobeVisualization = dynamic(() => import('@/components/realtime/GlobeVisualization'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '400px', background: 'rgba(0,0,0,0.5)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>Loading Globe...</div>
});

// Mock data for demos
const mockChartData = [
  { date: 'Nov 05', visitors: 650 },
  { date: 'Nov 09', visitors: 820 },
  { date: 'Nov 13', visitors: 1100 },
  { date: 'Nov 17', visitors: 780 },
  { date: 'Nov 21', visitors: 920 },
  { date: 'Nov 25', visitors: 650 },
  { date: 'Nov 29', visitors: 2100 },
  { date: 'Dec 03', visitors: 1800 },
];

const mockReferrers = [
  { name: 'X (Twitter)', value: 8000, icon: '𝕏' },
  { name: 'Direct / None', value: 3400 },
  { name: 'Google', value: 2500, icon: 'G' },
  { name: 'reddit.com', value: 2100 },
  { name: 'producthunt.com', value: 1248 },
  { name: 'YouTube', value: 545, icon: '▶' },
];

const mockCountries = [
  { name: 'United States', value: 4900, code: 'US' },
  { name: 'France', value: 1400, code: 'FR' },
  { name: 'United Kingdom', value: 1200, code: 'GB' },
  { name: 'Germany', value: 869, code: 'DE' },
  { name: 'Canada', value: 859, code: 'CA' },
  { name: 'Spain', value: 788, code: 'ES' },
];

const mockPages = [
  { name: '/', value: 21600 },
  { name: '/pricing', value: 4820 },
  { name: '/blog/getting-started', value: 2145 },
  { name: '/features', value: 1890 },
  { name: '/docs/api', value: 1456 },
];

const mockBrowsers = [
  { name: 'Chrome', value: 11200, icon: '🌐' },
  { name: 'Safari', value: 5700, icon: '🧭' },
  { name: 'Firefox', value: 537, icon: '🦊' },
  { name: 'Edge', value: 500, icon: '📘' },
];

const mockVisitors = [
  { id: '1', lat: 40.7128, lng: -74.006, country: 'US', city: 'New York' },
  { id: '2', lat: 51.5074, lng: -0.1278, country: 'GB', city: 'London' },
  { id: '3', lat: 48.8566, lng: 2.3522, country: 'FR', city: 'Paris' },
  { id: '4', lat: 35.6762, lng: 139.6503, country: 'JP', city: 'Tokyo' },
  { id: '5', lat: -33.8688, lng: 151.2093, country: 'AU', city: 'Sydney' },
  { id: '6', lat: 52.52, lng: 13.405, country: 'DE', city: 'Berlin' },
  { id: '7', lat: 37.7749, lng: -122.4194, country: 'US', city: 'San Francisco' },
  { id: '8', lat: 55.7558, lng: 37.6173, country: 'RU', city: 'Moscow' },
  { id: '9', lat: 1.3521, lng: 103.8198, country: 'SG', city: 'Singapore' },
  { id: '10', lat: 43.6532, lng: -79.3832, country: 'CA', city: 'Toronto' },
  { id: '11', lat: 19.4326, lng: -99.1332, country: 'MX', city: 'Mexico City' },
  { id: '12', lat: -23.5505, lng: -46.6333, country: 'BR', city: 'São Paulo' },
  { id: '13', lat: 28.6139, lng: 77.209, country: 'IN', city: 'New Delhi' },
  { id: '14', lat: 31.2304, lng: 121.4737, country: 'CN', city: 'Shanghai' },
  { id: '15', lat: 25.2048, lng: 55.2708, country: 'AE', city: 'Dubai' },
  { id: '16', lat: 59.3293, lng: 18.0686, country: 'SE', city: 'Stockholm' },
  { id: '17', lat: 41.9028, lng: 12.4964, country: 'IT', city: 'Rome' },
  { id: '18', lat: 40.4168, lng: -3.7038, country: 'ES', city: 'Madrid' },
  { id: '19', lat: 52.3676, lng: 4.9041, country: 'NL', city: 'Amsterdam' },
  { id: '20', lat: -34.6037, lng: -58.3816, country: 'AR', city: 'Buenos Aires' },
  { id: '21', lat: 22.3193, lng: 114.1694, country: 'HK', city: 'Hong Kong' },
  { id: '22', lat: 37.5665, lng: 126.978, country: 'KR', city: 'Seoul' },
  { id: '23', lat: 13.7563, lng: 100.5018, country: 'TH', city: 'Bangkok' },
  { id: '24', lat: 33.8688, lng: -118.2426, country: 'US', city: 'Los Angeles' },
  { id: '25', lat: 41.8781, lng: -87.6298, country: 'US', city: 'Chicago' },
];

export default function LandingPage() {
  return (
    <>
      <style jsx global>{`
        @media (max-width: 768px) {
          .landing-nav-links { display: none !important; }
          .landing-feature-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .landing-two-col { grid-template-columns: 1fr !important; text-align: center !important; gap: 2rem !important; }
          .landing-section { padding: 3rem 1rem !important; }
          .landing-globe { height: 280px !important; }
          .landing-stats { gap: 1rem !important; flex-wrap: wrap !important; }
          .landing-heading { font-size: 1.75rem !important; }
          .landing-metrics { grid-template-columns: repeat(2, 1fr) !important; gap: 1rem !important; }
          .landing-chart { height: 180px !important; }
          .landing-pricing { grid-template-columns: 1fr !important; }
          .landing-hero-buttons { flex-direction: column !important; width: 100% !important; }
          .landing-hero-buttons a { width: 100% !important; text-align: center !important; }
          .landing-nav-cta { padding: 0.4rem 0.75rem !important; font-size: 0.75rem !important; }
          .landing-footer-links { flex-direction: column !important; gap: 1rem !important; }
        }
        @media (max-width: 480px) {
          .landing-metrics { grid-template-columns: 1fr 1fr !important; }
          .landing-hero-badge { font-size: 0.75rem !important; padding: 0.2rem 0.5rem !important; }
        }
      `}</style>
      <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {/* Navigation */}
        <nav style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 50,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1.5rem',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src="/logo.png" alt="Fast Data" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
              <span style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>Fast Data</span>
            </div>
            <div className="landing-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <Link href="#features" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#9ca3af', textDecoration: 'none' }}>
                Features
              </Link>
              <Link href="#pricing" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#9ca3af', textDecoration: 'none' }}>
                Pricing
              </Link>
              <Link href="/login" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#9ca3af', textDecoration: 'none' }}>
                Sign In
              </Link>
              <Link
                href="/signup"
                className="landing-nav-cta"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  backgroundColor: '#2563eb',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  textDecoration: 'none'
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section style={{ paddingTop: '140px', paddingBottom: '60px', paddingLeft: '1rem', paddingRight: '1rem' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(59,130,246,0.1)',
              border: '1px solid rgba(59,130,246,0.2)',
              color: '#60a5fa',
              fontSize: '0.875rem',
              fontWeight: 500,
              marginBottom: '2rem'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                boxShadow: '0 0 8px #3b82f6'
              }}></span>
              Privacy-first • Cookie-free • Real-time
            </div>
            <h1 style={{
              fontSize: 'clamp(2rem, 7vw, 4rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
              lineHeight: 1.1,
              background: 'linear-gradient(to bottom, #fff, rgba(255,255,255,0.6))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Track every person that<br />visits your website.
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: '#9ca3af',
              maxWidth: '640px',
              margin: '0 auto 3rem',
              lineHeight: 1.6
            }}>
              Fast Data provides privacy-friendly, real-time analytics for your website.
              No cookies, no bloat, just the insights you need to grow.
            </p>
            <div className="landing-hero-buttons" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <Link
                href="/signup"
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: '#2563eb',
                  color: '#fff',
                  borderRadius: '12px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                Start Tracking <ArrowRight size={16} />
              </Link>
              <Link
                href="#pricing"
                style={{
                  padding: '1rem 2rem',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section style={{ padding: '0 1rem 6rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{
              background: 'linear-gradient(to bottom, #0a0a0a, #000)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
            }}>
              {/* Metrics Row */}
              <div className="landing-metrics" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '1.5rem',
                marginBottom: '1.5rem',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}>
                <MetricCard label="Visitors" value="20.4k" change="-7.2%" negative />
                <MetricCard label="Page views" value="48.2k" change="+12.5%" />
                <MetricCard label="Bounce rate" value="42%" change="-3.2%" />
                <MetricCard label="Session time" value="2m 36s" change="+8%" />
                <MetricCard label="Visitors now" value="13" live />
              </div>

              {/* Chart */}
              <div className="landing-chart" style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVisitorsLanding" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                    <XAxis dataKey="date" stroke="#444" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#444" fontSize={11} tickLine={false} axisLine={false} />
                    <Area type="monotone" dataKey="visitors" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitorsLanding)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid with Icons */}
        <section id="features" style={{
          padding: '6rem 1rem',
          backgroundColor: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1rem' }}>
                Everything you need to grow
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
                Powerful insights without the complexity. See exactly what's working and what needs attention.
              </p>
            </div>
            <div className="landing-feature-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}>
              <FeatureCard
                icon={<Zap size={24} color="#facc15" />}
                title="Lightweight Script"
                description="Our tracking script is less than 2kb. It loads asynchronously and never blocks your page rendering."
              />
              <FeatureCard
                icon={<Shield size={24} color="#4ade80" />}
                title="Privacy First"
                description="We don't use cookies and we don't track personal data. Fully GDPR, CCPA and PECR compliant."
              />
              <FeatureCard
                icon={<TrendingUp size={24} color="#60a5fa" />}
                title="Real-time Data"
                description="See who is on your site right now. Watch visitors navigate through your pages in real-time."
              />
            </div>
          </div>
        </section>

        {/* Real-time Globe Feature */}
        <section style={{ padding: '6rem 1rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
                <Radio size={18} />
                Real-time Tracking
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>
                See your visitors in real-time
              </h2>
              <p style={{ color: '#9ca3af', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
                Watch as visitors from around the world explore your site. Get instant insights into who's online right now.
              </p>
            </div>
            <div className="landing-globe" style={{
              height: '450px',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              background: '#000'
            }}>
              <GlobeVisualization visitors={mockVisitors} autoRotate={true} />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              marginTop: '1.5rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>25</div>
                <div style={{ fontSize: '0.875rem', color: '#888' }}>Visitors now</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>18</div>
                <div style={{ fontSize: '0.875rem', color: '#888' }}>Countries</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>12</div>
                <div style={{ fontSize: '0.875rem', color: '#888' }}>Active pages</div>
              </div>
            </div>
          </div>
        </section>

        {/* Referrers Feature */}
        <section style={{ padding: '6rem 1rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div className="landing-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#f97316', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
                  <LinkIcon size={18} />
                  Traffic Sources
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 }}>
                  Know exactly where your traffic comes from
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '1.125rem', lineHeight: 1.6 }}>
                  Track referrers, campaigns, and channels. See which sources drive the most engaged visitors and optimize your marketing spend.
                </p>
              </div>
              <DemoDataCard title="Top Referrers" data={mockReferrers} />
            </div>
          </div>
        </section>

        {/* Geography Feature */}
        <section style={{ padding: '6rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div className="landing-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
              <DemoDataCard title="Top Countries" data={mockCountries} showFlags />
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
                  <MapPin size={18} />
                  Geographic Insights
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 }}>
                  Understand your global audience
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '1.125rem', lineHeight: 1.6 }}>
                  See which countries, regions, and cities your visitors are coming from. Optimize content and timing for your target markets.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pages Feature */}
        <section style={{ padding: '6rem 1rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div className="landing-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#a855f7', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
                  <FileText size={18} />
                  Page Analytics
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 }}>
                  Find your best performing content
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '1.125rem', lineHeight: 1.6 }}>
                  See which pages get the most traffic, where users enter, and where they leave. Double down on what works.
                </p>
              </div>
              <DemoDataCard title="Top Pages" data={mockPages} />
            </div>
          </div>
        </section>

        {/* Browsers Feature */}
        <section style={{ padding: '6rem 1rem', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div className="landing-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
              <DemoDataCard title="Browsers" data={mockBrowsers} />
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
                  <Monitor size={18} />
                  Device Intelligence
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 }}>
                  Optimize for every device
                </h2>
                <p style={{ color: '#9ca3af', fontSize: '1.125rem', lineHeight: 1.6 }}>
                  Know which browsers, operating systems, and devices your audience uses. Ensure a perfect experience for everyone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" style={{ padding: '6rem 1rem' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1rem' }}>Simple, transparent pricing</h2>
            <p style={{ color: '#9ca3af', marginBottom: '4rem', fontSize: '1.125rem' }}>Choose the plan that fits your needs. No hidden fees.</p>

            <div className="landing-pricing" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              alignItems: 'start'
            }}>
              {/* Monthly Plan */}
              <div style={{
                padding: '2rem',
                borderRadius: '24px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'left'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Monthly</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 700 }}>$9</span>
                  <span style={{ color: '#9ca3af' }}>/month</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <PricingFeature text="Unlimited websites" />
                  <PricingFeature text="100k pageviews/mo" />
                  <PricingFeature text="Real-time analytics" />
                  <PricingFeature text="Data retention: 1 year" />
                  <PricingFeature text="Email support" />
                </ul>
                <Link
                  href="/signup?plan=monthly"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontWeight: 600,
                    textDecoration: 'none',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}
                >
                  Subscribe Monthly
                </Link>
              </div>

              {/* Lifetime Plan */}
              <div style={{
                padding: '2rem',
                borderRadius: '24px',
                background: 'linear-gradient(to bottom, rgba(37,99,235,0.2), rgba(30,58,138,0.1))',
                border: '1px solid rgba(59,130,246,0.3)',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: '#2563eb',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.75rem',
                  borderBottomLeftRadius: '12px'
                }}>
                  BEST VALUE
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: '#60a5fa' }}>Lifetime Deal</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 700 }}>$39</span>
                  <span style={{ color: '#9ca3af' }}>/one-time</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <PricingFeature text="Unlimited websites" />
                  <PricingFeature text="Unlimited pageviews" />
                  <PricingFeature text="Real-time analytics" />
                  <PricingFeature text="Lifetime data retention" />
                  <PricingFeature text="Priority support" />
                  <PricingFeature text="Future updates included" />
                </ul>
                <Link
                  href="/signup?plan=lifetime"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '12px',
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    fontWeight: 600,
                    textDecoration: 'none',
                    textAlign: 'center',
                    boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
                    boxSizing: 'border-box'
                  }}
                >
                  Get Lifetime Access
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          padding: '6rem 1rem',
          background: 'linear-gradient(to bottom, rgba(37,99,235,0.1), transparent)',
          borderTop: '1px solid rgba(59,130,246,0.2)'
        }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 700, marginBottom: '1rem' }}>
              Ready to understand your audience?
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '1.125rem', marginBottom: '2rem' }}>
              Join thousands of websites using Fast Data for privacy-friendly analytics.
            </p>
            <Link
              href="/signup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 2rem',
                backgroundColor: '#2563eb',
                color: '#fff',
                borderRadius: '12px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Get Started Free <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: '3rem 1rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.875rem'
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <img src="/logo.png" alt="Fast Data" style={{ width: '24px', height: '24px', borderRadius: '4px', opacity: 0.5, filter: 'grayscale(1)' }} />
              <span style={{ fontWeight: 600 }}>Fast Data</span>
            </div>
            <div className="landing-footer-links" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
              <Link href="/terms" style={{ color: '#6b7280', textDecoration: 'none' }}>Terms</Link>
              <Link href="/privacy" style={{ color: '#6b7280', textDecoration: 'none' }}>Privacy</Link>
              <a href="mailto:support@fastdata.com" style={{ color: '#6b7280', textDecoration: 'none' }}>Contact</a>
            </div>
            <p>© {new Date().getFullYear()} Fast Data. All rights reserved.</p>
          </div>
        </footer>

        {/* Tracking Script */}
        <script defer src="https://data.flightlabs.agency/trackify.js" data-site-id="data-flightlabs-agency-10zgo"></script>
      </div>
    </>
  );
}

// Helper Components
function MetricCard({ label, value, change, negative, live }: { label: string; value: string; change?: string; negative?: boolean; live?: boolean }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#888' }}>{label}</span>
        {live && <span style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 8px #3b82f6' }}></span>}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>{value}</div>
      {change && (
        <div style={{ fontSize: '0.75rem', color: negative ? '#ef4444' : '#22c55e', marginTop: '0.25rem' }}>
          {change}
        </div>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div style={{
      padding: '1.5rem',
      borderRadius: '16px',
      backgroundColor: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: '#9ca3af', lineHeight: 1.6, fontSize: '0.875rem' }}>{description}</p>
    </div>
  );
}

function DemoDataCard({ title, data, showFlags }: { title: string; data: any[]; showFlags?: boolean }) {
  const maxValue = Math.max(...data.map(d => d.value), 0);

  function getFlagEmoji(countryCode: string) {
    const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  function formatValue(val: number) {
    if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
    return val.toString();
  }

  return (
    <div style={{
      background: '#0a0a0a',
      border: '1px solid #222',
      borderRadius: '12px',
      padding: '1.25rem'
    }}>
      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#888', marginBottom: '1rem' }}>{title}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {data.map((item, i) => {
          const percent = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          return (
            <div key={i} style={{ position: 'relative', padding: '0.5rem 0' }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${percent}%`,
                background: 'rgba(156, 163, 175, 0.15)',
                borderRadius: '4px'
              }} />
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1, padding: '0 0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {showFlags && item.code && <span>{getFlagEmoji(item.code)}</span>}
                  {item.icon && <span style={{ opacity: 0.7 }}>{item.icon}</span>}
                  {item.name}
                </span>
                <span style={{ fontSize: '0.875rem', color: '#fff', fontWeight: 600 }}>{formatValue(item.value)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#d1d5db' }}>
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: 'rgba(59,130,246,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Check size={12} color="#60a5fa" />
      </div>
      <span>{text}</span>
    </li>
  );
}
