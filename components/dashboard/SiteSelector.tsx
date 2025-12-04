'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, Globe } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Site {
    id: string;
    site_id: string;
    domain: string;
    name: string;
}

interface SiteSelectorProps {
    selectedSiteId: string | null;
    onSiteChange: (siteId: string) => void;
}

export default function SiteSelector({ selectedSiteId, onSiteChange }: SiteSelectorProps) {
    const [sites, setSites] = useState<Site[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSites = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('sites')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) {
                setSites(data);
                // Select first site if none selected
                if (!selectedSiteId && data.length > 0) {
                    onSiteChange(data[0].site_id);
                }
            }
            setLoading(false);
        };

        fetchSites();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const selectedSite = sites.find(s => s.site_id === selectedSiteId);

    if (loading) return <div style={{ color: '#666', fontSize: '0.875rem' }}>Loading sites...</div>;

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#1a1a1a',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #333',
                    cursor: 'pointer',
                    minWidth: '200px'
                }}
            >
                <div style={{ width: '20px', height: '20px', background: '#ff4f00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Globe size={12} color="#fff" />
                </div>
                <span style={{ fontWeight: 500, fontSize: '0.875rem', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {selectedSite ? selectedSite.domain : 'Select Site'}
                </span>
                <ChevronDown size={14} style={{ opacity: 0.5 }} />
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    minWidth: '200px',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    marginTop: '0.5rem',
                    zIndex: 50,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    overflow: 'hidden'
                }}>
                    {sites.map(site => (
                        <div
                            key={site.id}
                            onClick={() => {
                                onSiteChange(site.site_id);
                                setIsOpen(false);
                            }}
                            style={{
                                padding: '0.75rem 1rem',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                color: site.site_id === selectedSiteId ? '#fff' : '#aaa',
                                background: site.site_id === selectedSiteId ? 'rgba(255,255,255,0.05)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={(e) => {
                                if (site.site_id !== selectedSiteId) e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <Globe size={14} />
                            {site.domain}
                        </div>
                    ))}
                    <div style={{ height: '1px', background: '#333', margin: '0.25rem 0' }}></div>
                    <a
                        href="/dashboard/add-site"
                        style={{
                            padding: '0.75rem 1rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            color: '#3b82f6',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            textDecoration: 'none'
                        }}
                    >
                        <Plus size={14} />
                        Add New Site
                    </a>
                </div>
            )}
        </div>
    );
}
