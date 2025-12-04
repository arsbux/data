'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { ChevronDown, RefreshCw, ChevronLeft, ChevronRight, CheckSquare, Square, Settings } from 'lucide-react';

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
    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${minutes}m ${secs}s`;
    };

    const formatXAxis = (tickItem: string) => {
        if (!tickItem) return '';
        const date = new Date(tickItem);
        if (range === '24h') {
            // Format like 2am, 5am, etc.
            return date.toLocaleTimeString([], { hour: 'numeric', hour12: true }).toLowerCase().replace(' ', '');
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
                }}>
                    <p style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>
                        {new Date(label).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                        })}
                    </p>
                    <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>
                        {payload[0].value} Visitors
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-card" style={{
            padding: '1.5rem',
            background: '#0a0a0a',
            border: '1px solid #222',
            borderRadius: '12px',
            color: '#fff'
        }}>
            {/* Header Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>

                {/* Site Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#1a1a1a',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        cursor: 'pointer'
                    }}>
                        <div style={{ width: '20px', height: '20px', background: '#ff4f00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '12px' }}>🐶</span>
                        </div>
                        <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>producthuntr.com</span>
                        <ChevronDown size={14} style={{ opacity: 0.5 }} />
                    </div>
                    <button style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' }}>
                        <Settings size={16} />
                    </button>
                </div>

                {/* Date Nav */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1a1a1a', padding: '0.25rem', borderRadius: '8px', border: '1px solid #333' }}>
                    <button style={{ background: 'transparent', border: 'none', color: '#888', padding: '0.25rem', cursor: 'pointer' }}>
                        <ChevronLeft size={16} />
                    </button>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, padding: '0 0.5rem', minWidth: '100px', textAlign: 'center' }}>
                        {range === '24h' ? new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Last 7 Days'}
                    </span>
                    <button style={{ background: 'transparent', border: 'none', color: '#888', padding: '0.25rem', cursor: 'pointer' }}>
                        <ChevronRight size={16} />
                    </button>
                </div>

                {/* Interval Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <select
                            value={range}
                            onChange={(e) => onRangeChange(e.target.value)}
                            style={{
                                appearance: 'none',
                                background: '#1a1a1a',
                                border: '1px solid #333',
                                color: '#fff',
                                padding: '0.5rem 2rem 0.5rem 1rem',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="24h">Hourly</option>
                            <option value="7d">Daily</option>
                            <option value="30d">Monthly</option>
                        </select>
                        <ChevronDown size={14} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#666' }} />
                    </div>

                    <button style={{ background: '#1a1a1a', border: '1px solid #333', color: '#666', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '2rem',
                marginBottom: '2rem',
                alignItems: 'start'
            }}>

                {/* Visitors (Active) */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <CheckSquare size={16} color="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                        <span style={{ fontSize: '0.875rem', color: '#ccc' }}>Visitors</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>{stats.visitors.toLocaleString()}</div>
                </div>

                {/* Inactive Metrics */}
                <div style={{ opacity: 0.5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Square size={16} color="#444" />
                        <span style={{ fontSize: '0.875rem', color: '#888' }}>Your #1 KPI</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#888' }}>-</div>
                </div>

                <div style={{ opacity: 0.5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#888' }}>Conversion rate</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#888' }}>-</div>
                </div>

                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Square size={16} color="#444" />
                        <span style={{ fontSize: '0.875rem', color: '#888' }}>Bounce rate</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>{stats.bounceRate}%</div>
                </div>

                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Square size={16} color="#444" />
                        <span style={{ fontSize: '0.875rem', color: '#888' }}>Session time</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>{formatDuration(stats.avgSessionTime)}</div>
                </div>

                {/* Visitors Now */}
                <div style={{ borderLeft: '1px solid #333', paddingLeft: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#ccc' }}>Visitors now</span>
                        <span style={{ width: '6px', height: '6px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 8px #3b82f6' }}></span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff' }}>{visitorsNow}</div>
                </div>
            </div>

            {/* Chart Area */}
            <div style={{ width: '100%', height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatXAxis}
                            stroke="#444"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                            minTickGap={40}
                        />
                        <YAxis
                            stroke="#444"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Area
                            type="monotone"
                            dataKey="visitors"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorVisitors)"
                            animationDuration={1000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
