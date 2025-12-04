'use client';

import { Check, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#000',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{ maxWidth: '900px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', textDecoration: 'none', color: '#9ca3af' }}>
                        <img src="/logo.png" alt="Fast Data" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                        <span style={{ fontWeight: 700, fontSize: '1.25rem', color: '#fff' }}>Fast Data</span>
                    </Link>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Select a Plan</h1>
                    <p style={{ color: '#9ca3af' }}>Choose a subscription to access Fast Data</p>
                </div>

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
                            <PricingFeature text="Cancel anytime" />
                        </ul>
                        <a
                            href="/api/checkout?plan=monthly"
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
                        </a>
                    </div>

                    {/* Lifetime Plan */}
                    <div style={{
                        padding: '2rem',
                        borderRadius: '24px',
                        background: 'linear-gradient(to bottom, rgba(37,99,235,0.2), rgba(30,58,138,0.1))',
                        border: '1px solid rgba(59,130,246,0.3)',
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
                            <PricingFeature text="Lifetime access" />
                            <PricingFeature text="Future updates included" />
                        </ul>
                        <a
                            href="/api/checkout?plan=lifetime"
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
                        </a>
                    </div>
                </div>

                <p style={{ marginTop: '2rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
                    Secure payment powered by Dodo Payments. 30-day money-back guarantee.
                </p>
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
