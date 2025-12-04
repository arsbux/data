'use client';

import { useEffect, useState } from 'react';
import GlobeVisualization from '@/components/realtime/GlobeVisualization';
import { createClient } from '@/lib/supabase/client';
import { Maximize2, Minimize2, Share2, Music, User } from 'lucide-react';

interface Visitor {
    id: string;
    lat: number;
    lng: number;
    country: string;
    city: string;
    page: string;
    lastSeen: string;
    device: string;
    referrer: string;
}

export default function RealtimePage() {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [loading, setLoading] = useState(true);
    const [autoRotate, setAutoRotate] = useState(true);

    const fetchVisitors = async () => {
        const supabase = createClient();
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
                lastSeen: v.last_seen,
                device: v.device_type || 'Desktop',
                referrer: v.referrer_domain || 'Direct'
            })));
        }
        setLoading(false);
    };

    useEffect(() => {
        const supabase = createClient();

        fetchVisitors();

        // Realtime subscription
        const channel = supabase
            .channel('realtime_visitors')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'active_visitors' }, (payload) => {
                fetchVisitors();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Group stats
    const referrers = visitors.reduce((acc, v) => {
        acc[v.referrer] = (acc[v.referrer] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const countries = visitors.reduce((acc, v) => {
        acc[v.country] = (acc[v.country] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const devices = visitors.reduce((acc, v) => {
        acc[v.device] = (acc[v.device] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div style={{
            width: '100%',
            height: 'calc(100vh - 2rem)',
            position: 'relative',
            background: 'radial-gradient(circle at center, #111827 0%, #000 100%)',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #333'
        }}>
            {/* Starry Background (Simple CSS) */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px), radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 2px), radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 3px)',
                backgroundSize: '550px 550px, 350px 350px, 250px 250px',
                backgroundPosition: '0 0, 40px 60px, 130px 270px',
                opacity: 0.3
            }}></div>

            {/* Globe */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                <GlobeVisualization visitors={visitors} autoRotate={autoRotate} />
            </div>

            {/* Top Left Stats Card */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 10,
                background: 'rgba(20, 20, 20, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                width: '320px',
                color: '#fff'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#ff4f00' }}>
                        <span>DataFast</span>
                        <span style={{ color: '#666' }}>|</span>
                        <span style={{ color: '#888' }}>REAL-TIME</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => setAutoRotate(!autoRotate)}
                            title={autoRotate ? "Pause Rotation" : "Start Rotation"}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: autoRotate ? '#3b82f6' : '#666' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                                <path d="M21 3v5h-5" />
                            </svg>
                        </button>
                        <button
                            onClick={() => fetchVisitors()}
                            title="Refresh Data"
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#666' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                                <path d="M21 3v5h-5" />
                                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                                <path d="M8 16H3v5" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 8px #3b82f6' }}></span>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{visitors.length} visitors on</span>
                    <span style={{ fontWeight: 600, color: '#ff4f00' }}>producthuntr.com</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#aaa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Referrers</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {Object.entries(referrers).slice(0, 2).map(([name, count]) => (
                                <span key={name} style={{ color: '#fff' }}>{name === 'Direct' ? '∞ Direct' : name} ({count})</span>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Countries</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {Object.entries(countries).slice(0, 2).map(([code, count]) => (
                                <span key={code} style={{ color: '#fff' }}>{getFlagEmoji(code)} {code} ({count})</span>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Devices</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {Object.entries(devices).slice(0, 2).map(([name, count]) => (
                                <span key={name} style={{ color: '#fff' }}>🖥 {name} ({count})</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Left Live Feed */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                zIndex: 10,
                background: 'rgba(20, 20, 20, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '1rem',
                width: '320px',
                maxHeight: '300px',
                overflowY: 'hidden',
                color: '#fff'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {visitors.slice(0, 5).map((v, i) => (
                        <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', opacity: 1 - (i * 0.15) }}>
                            <span style={{ fontSize: '1rem' }}>👁</span>
                            <div>
                                <span style={{ color: '#fff', fontWeight: 600 }}>{v.city || 'Unknown visitor'}</span>
                                <span style={{ color: '#888' }}> from </span>
                                <span style={{ color: '#fff' }}>{getFlagEmoji(v.country)} {v.country}</span>
                                <span style={{ color: '#888' }}> visited </span>
                                <span style={{ color: '#fff', fontFamily: 'monospace' }}>{v.page}</span>
                            </div>
                        </div>
                    ))}
                    {visitors.length === 0 && <div style={{ color: '#666', fontSize: '0.8rem' }}>Waiting for visitors...</div>}
                </div>
            </div>
        </div>
    );
}

function getFlagEmoji(countryCode: string) {
    if (!countryCode || countryCode === 'Unknown') return '🌍';
    try {
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    } catch {
        return '🌍';
    }
}
