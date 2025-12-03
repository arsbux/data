'use client';

import { useEffect, useState } from 'react';
import GlobeVisualization from '@/components/realtime/GlobeVisualization';
import { createClient } from '@/lib/supabase/client';
import styles from '../page.module.css';

interface Visitor {
    id: string;
    lat: number;
    lng: number;
    country: string;
    city: string;
    page: string;
    lastSeen: string;
}

export default function RealtimePage() {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        // Initial fetch
        const fetchVisitors = async () => {
            const { data, error } = await supabase
                .from('active_visitors')
                .select('*')
                .gt('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Last 5 mins

            if (data) {
                setVisitors(data.map(v => ({
                    id: v.visitor_id,
                    lat: v.latitude || 0,
                    lng: v.longitude || 0,
                    country: v.country_code || 'Unknown',
                    city: v.city || 'Unknown',
                    page: v.current_page,
                    lastSeen: v.last_seen
                })));
            }
            setLoading(false);
        };

        fetchVisitors();

        // Realtime subscription
        const channel = supabase
            .channel('realtime_visitors')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'active_visitors' }, (payload) => {
                fetchVisitors(); // Refresh on any change for simplicity
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Real-time Visitors</h1>
                <div className={styles.liveIndicator} style={{ fontSize: '1.2rem' }}>
                    ● {visitors.length} Active Users
                </div>
            </div>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                <GlobeVisualization visitors={visitors} />

                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: 'rgba(0,0,0,0.7)',
                    padding: '1rem',
                    borderRadius: '8px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    width: '300px'
                }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#9ca3af' }}>Live Feed</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {visitors.map(v => (
                            <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>{getFlagEmoji(v.country)}</span>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{v.city || 'Unknown'}</div>
                                    <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Visited {v.page}</div>
                                </div>
                            </div>
                        ))}
                        {visitors.length === 0 && <div style={{ color: '#666' }}>No active visitors</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

function getFlagEmoji(countryCode: string) {
    if (!countryCode || countryCode === 'Unknown') return '🌍';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}
