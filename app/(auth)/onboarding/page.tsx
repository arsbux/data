'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from '../login/login.module.css';

export default function OnboardingPage() {
    const [siteName, setSiteName] = useState('');
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [siteId, setSiteId] = useState('');
    const [showScript, setShowScript] = useState(false);
    const router = useRouter();

    const generateSiteId = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    const handleCreateSite = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setError('You must be logged in');
            setLoading(false);
            return;
        }

        const newSiteId = generateSiteId();

        const { error } = await supabase
            .from('sites')
            .insert({
                user_id: user.id,
                name: siteName,
                domain: domain,
                site_id: newSiteId,
            });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSiteId(newSiteId);
            setShowScript(true);
            setLoading(false);
        }
    };

    const trackingScript = `<script defer src="${typeof window !== 'undefined' ? window.location.origin : ''}/trackify.js" data-site-id="${siteId}"></script>`;

    if (showScript) {
        return (
            <div className={styles.container}>
                <div className={styles.card} style={{ maxWidth: '600px' }}>
                    <div className={styles.header}>
                        <h1 className={styles.logo}>🎉 Site Created!</h1>
                        <p className={styles.subtitle}>Add this tracking script to your website</p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                            Tracking Script
                        </label>
                        <div style={{
                            background: 'var(--bg-tertiary)',
                            padding: '1rem',
                            borderRadius: '8px',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            wordBreak: 'break-all',
                            border: '1px solid var(--border-primary)'
                        }}>
                            {trackingScript}
                        </div>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Copy this code and paste it in the {'<head>'} section of your website
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(trackingScript);
                            alert('Copied to clipboard!');
                        }}
                        className="btn btn-secondary"
                        style={{ width: '100%', marginBottom: '0.75rem' }}
                    >
                        Copy Script
                    </button>

                    <button
                        onClick={() => router.push('/dashboard')}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.logo}>🚀 Add Your First Site</h1>
                    <p className={styles.subtitle}>Let's get started with tracking your website</p>
                </div>

                <form onSubmit={handleCreateSite} className={styles.form}>
                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    <div className={styles.field}>
                        <label htmlFor="siteName">Site Name</label>
                        <input
                            id="siteName"
                            type="text"
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                            placeholder="My Awesome Website"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="domain">Domain</label>
                        <input
                            id="domain"
                            type="text"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder="example.com"
                            required
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                            Enter your domain without https://
                        </p>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                        {loading ? 'Creating...' : 'Create Site'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <button
                        onClick={() => router.push('/dashboard')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                        }}
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
}
