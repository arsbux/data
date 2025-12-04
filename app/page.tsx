'use client';
import Link from "next/link";
import { ArrowRight, Check, Zap, Globe, Shield } from "lucide-react";

export default function LandingPage() {
  return (
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/login" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#9ca3af', textDecoration: 'none' }}>
              Sign In
            </Link>
            <Link
              href="/signup"
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
      <section style={{ paddingTop: '160px', paddingBottom: '80px', paddingLeft: '1rem', paddingRight: '1rem' }}>
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
            v1.0 is now live
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            lineHeight: 1.1,
            background: 'linear-gradient(to bottom, #fff, rgba(255,255,255,0.6))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Web analytics that<br />doesn't slow you down.
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
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
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

      {/* Features Grid */}
      <section style={{
        padding: '6rem 1rem',
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
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
              icon={<Globe size={24} color="#60a5fa" />}
              title="Privacy First"
              description="We don't use cookies and we don't track personal data. Fully GDPR, CCPA and PECR compliant."
            />
            <FeatureCard
              icon={<Shield size={24} color="#4ade80" />}
              title="Real-time Data"
              description="See who is on your site right now. Watch visitors navigate through your pages in real-time."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '6rem 1rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1rem' }}>Simple, transparent pricing</h2>
          <p style={{ color: '#9ca3af', marginBottom: '4rem', fontSize: '1.125rem' }}>Choose the plan that fits your needs. No hidden fees.</p>

          <div style={{
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
                  textAlign: 'center'
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
                  boxShadow: '0 4px 14px rgba(37,99,235,0.4)'
                }}
              >
                Get Lifetime Access
              </Link>
            </div>
          </div>
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
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
            <Link href="/terms" style={{ color: '#6b7280', textDecoration: 'none' }}>Terms</Link>
            <Link href="/privacy" style={{ color: '#6b7280', textDecoration: 'none' }}>Privacy</Link>
            <a href="mailto:support@fastdata.com" style={{ color: '#6b7280', textDecoration: 'none' }}>Contact</a>
          </div>
          <p>© {new Date().getFullYear()} Fast Data. All rights reserved.</p>
        </div>
      </footer>
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
