'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { ChevronDown, RefreshCw, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface AnalyticsChartProps {
    stats: {
        visitors: number;
        pageViews: number;
        bounceRate: number;
        avgSessionTime: number;
    };
    visitorsNow: number;
    data: { date: string; visitors: number }[];
    range: string;
    onRangeChange: (range: string) => void;
}

export default function AnalyticsChart({ stats, visitorsNow, data, range, onRangeChange }: AnalyticsChartProps) {
    const [selectedMetric, setSelectedMetric] = useState('visitors');

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${minutes}m ${secs}s`;
    };

    // Format date for X-axis based on range
    const formatXAxis = (tickItem: string) => {
        if (!tickItem) return '';
        const date = new Date(tickItem);
        if (range === '24h') {
            return date.toLocaleTimeString([], { hour: 'numeric', hour12: true }).toLowerCase();
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    return (
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
                    <div style={{ width: '20px', height: '20px', background: '#ff4f00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '12px' }}>🐶</span>
                    </div>
                    <span style={{ fontWeight: 500 }}>producthuntr.com</span>
                    <ChevronDown size={16} style={{ opacity: 0.5 }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
                        <button
                            onClick={() => { }} // TODO: Implement prev date
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '0.25rem', cursor: 'pointer' }}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, padding: '0 0.5rem' }}>
                            {range === '24h' ? 'Today' : 'Last 7 Days'}
                        </span>
                        <button
                            onClick={() => { }} // TODO: Implement next date
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '0.25rem', cursor: 'pointer' }}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <select
                            value={range}
                            onChange={(e) => onRangeChange(e.target.value)}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-primary)',
                                color: 'var(--text-primary)',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="24h">Hourly</option>
                            <option value="7d">Daily</option>
                        </select>

                        <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
                            <RefreshCw size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', alignItems: 'start' }}>
                {/* Visitors (Active) */}
                <div style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ width: '16px', height: '16px', background: '#3b82f6', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={12} color="white" />
                        </div>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Visitors</span>
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stats.visitors.toLocaleString()}</div>
                </div>

                {/* Other Metrics (Inactive style for now) */}
                <div style={{ cursor: 'pointer', opacity: 0.6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ width: '16px', height: '16px', border: '1px solid var(--text-secondary)', borderRadius: '4px' }}></div>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Page Views</span>
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stats.pageViews.toLocaleString()}</div>
                </div>

                <div style={{ cursor: 'pointer', opacity: 0.6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ width: '16px', height: '16px', border: '1px solid var(--text-secondary)', borderRadius: '4px' }}></div>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Bounce rate</span>
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stats.bounceRate}%</div>
                </div>

                <div style={{ cursor: 'pointer', opacity: 0.6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ width: '16px', height: '16px', border: '1px solid var(--text-secondary)', borderRadius: '4px' }}></div>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Session time</span>
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{formatDuration(stats.avgSessionTime)}</div>
                </div>

                {/* Visitors Now */}
                <div style={{ borderLeft: '1px solid var(--border-primary)', paddingLeft: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Visitors now</span>
                        <span style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 8px #3b82f6' }}></span>
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{visitorsNow}</div>
                </div>
            </div>

            {/* Chart Area */}
            <div style={{ width: '100%', height: '350px', marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatXAxis}
                            stroke="#666"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#666"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1a1a1a',
                                border: '1px solid #333',
                                borderRadius: '8px',
                                color: '#fff',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }}
                            itemStyle={{ color: '#fff' }}
                            labelStyle={{ color: '#888', marginBottom: '0.5rem' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="visitors"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorVisitors)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
