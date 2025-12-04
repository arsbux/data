'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';
import { Globe, Copy, Check, Trash2, Plus, ExternalLink, Loader2 } from 'lucide-react';

interface Site {
    id: string;
    site_id: string;
    domain: string;
    name: string;
    created_at: string;
}

export default function SitesPage() {
    const router = useRouter();
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchSites();
    }, []);

    const fetchSites = async () => {
        try {
            const res = await fetch('/api/sites');
            const data = await res.json();
            setSites(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch sites', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyCode = (site: Site) => {
        const code = `<script defer src="https://data.flightlabs.agency/trackify.js" data-site-id="${site.site_id}"></script>`;
        navigator.clipboard.writeText(code);
        setCopiedId(site.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Sites</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Sites</h1>
                <button
                    onClick={() => router.push('/dashboard/add-site')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.625rem 1rem',
                        background: 'var(--accent-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    <Plus size={18} />
                    Add Site
                </button>
            </div>

            {sites.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <Globe size={32} color="white" />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No sites yet</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Add your first website to start tracking analytics
                    </p>
                    <button
                        onClick={() => router.push('/dashboard/add-site')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            background: 'var(--accent-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        <Plus size={18} />
                        Add Website
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {sites.map(site => (
                        <div
                            key={site.id}
                            className="glass-card"
                            style={{ padding: '1.25rem' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(147,51,234,0.2))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Globe size={20} color="#60a5fa" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.125rem', margin: 0, color: 'var(--text-primary)' }}>
                                                {site.name || site.domain}
                                            </h3>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                {site.domain}
                                                <a
                                                    href={`https://${site.domain}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#60a5fa' }}
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                                        Added {formatDate(site.created_at)} • ID: <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>{site.site_id}</code>
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleCopyCode(site)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.375rem',
                                            padding: '0.5rem 0.875rem',
                                            background: copiedId === site.id ? '#22c55e' : 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '0.8125rem',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {copiedId === site.id ? <Check size={14} /> : <Copy size={14} />}
                                        {copiedId === site.id ? 'Copied!' : 'Copy Code'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
