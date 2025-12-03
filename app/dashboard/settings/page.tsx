'use client';

import styles from '../page.module.css';

export default function SettingsPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Settings</h1>
            </div>
            <div className="glass-card">
                <h3 className={styles.cardTitle}>Tracking Script</h3>
                <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                    Add this script to your website's <code>&lt;head&gt;</code> tag.
                </p>
                <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    wordBreak: 'break-all',
                    border: '1px solid var(--border-primary)'
                }}>
                    {`<script defer src="${typeof window !== 'undefined' ? window.location.origin : ''}/trackify.js" data-site-id="YOUR_SITE_ID"></script>`}
                </div>
            </div>
        </div>
    );
}
