'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';
import { Check, Copy, ArrowRight } from 'lucide-react';

export default function AddSitePage() {
    const router = useRouter();
    const [domain, setDomain] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ site: any; trackingCode: string } | null>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await fetch('/api/sites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain, name }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to add site');
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (result) {
            navigator.clipboard.writeText(result.trackingCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Add New Site</h1>
            </div>

            <div className="glass-card" style={{ maxWidth: '600px' }}>
                {!result ? (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                Website Domain / URL
                            </label>
                            <input
                                type="text"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                placeholder="example.com"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid var(--border-primary)',
                                    borderRadius: '6px',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                Site Name (Optional)
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="My Awesome Blog"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid var(--border-primary)',
                                    borderRadius: '6px',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        {error && (
                            <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '0.75rem',
                                background: 'var(--accent-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Adding Site...' : 'Add Site'}
                        </button>
                    </form>
                ) : (
                    <div>
                        {/* Success Header */}
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem'
                            }}>
                                <Check size={32} color="white" strokeWidth={3} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                Site Added Successfully!
                            </h2>
                            <p style={{ color: 'var(--text-secondary)' }}>
                                You're ready to track <strong style={{ color: '#60a5fa' }}>{result.site.domain}</strong>
                            </p>
                        </div>

                        {/* Tracking Code Section */}
                        <div style={{
                            background: 'rgba(0,0,0,0.4)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            marginBottom: '1.5rem',
                            border: '1px solid var(--border-primary)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>
                                    📋 Your Tracking Code
                                </h3>
                                <button
                                    onClick={handleCopy}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        background: copied ? '#22c55e' : 'var(--accent-primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? 'Copied!' : 'Copy Code'}
                                </button>
                            </div>

                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                Add this code to the <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.125rem 0.5rem', borderRadius: '4px' }}>&lt;head&gt;</code> section of your website:
                            </p>

                            <div style={{
                                background: '#0d1117',
                                padding: '1rem',
                                borderRadius: '8px',
                                fontFamily: 'ui-monospace, Menlo, Monaco, "Cascadia Mono", monospace',
                                fontSize: '0.8rem',
                                lineHeight: 1.6,
                                border: '1px solid rgba(255,255,255,0.1)',
                                overflow: 'auto'
                            }}>
                                <div style={{ color: '#7ee787' }}>&lt;!-- Fast Data Analytics --&gt;</div>
                                <div>
                                    <span style={{ color: '#ff7b72' }}>&lt;script</span>
                                    <span style={{ color: '#79c0ff' }}> defer</span>
                                </div>
                                <div style={{ paddingLeft: '1rem' }}>
                                    <span style={{ color: '#79c0ff' }}>src</span>
                                    <span style={{ color: '#c9d1d9' }}>=</span>
                                    <span style={{ color: '#a5d6ff' }}>"https://data.flightlabs.agency/trackify.js"</span>
                                </div>
                                <div style={{ paddingLeft: '1rem' }}>
                                    <span style={{ color: '#79c0ff' }}>data-site-id</span>
                                    <span style={{ color: '#c9d1d9' }}>=</span>
                                    <span style={{ color: '#a5d6ff' }}>"{result.site.site_id}"</span>
                                </div>
                                <div>
                                    <span style={{ color: '#ff7b72' }}>&gt;&lt;/script&gt;</span>
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            borderRadius: '8px',
                            padding: '1rem',
                            marginBottom: '1.5rem',
                            border: '1px solid rgba(59, 130, 246, 0.3)'
                        }}>
                            <p style={{ fontSize: '0.875rem', color: '#93c5fd', margin: 0 }}>
                                <strong>💡 Tip:</strong> After adding the code, visit your website and you'll start seeing analytics data in real-time!
                            </p>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => router.push('/dashboard')}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '0.875rem',
                                background: 'var(--accent-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            View Analytics Dashboard
                            <ArrowRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
