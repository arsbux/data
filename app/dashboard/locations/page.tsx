'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/dashboard/DataTable';
import styles from '../page.module.css';

export default function LocationsPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('7d');
    const [activeTab, setActiveTab] = useState('country');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/analytics/locations?range=${range}&type=${activeTab}`);
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [range, activeTab]);

    const columns = [
        {
            key: 'name',
            label: activeTab === 'city' ? 'City' : activeTab === 'region' ? 'Region' : 'Country',
            render: (value: string, row: any) => (
                <span>{row.code ? getFlagEmoji(row.code) + ' ' : ''}{value}</span>
            )
        },
        { key: 'value', label: 'Visitors' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Top Locations</h1>
                <select
                    className={styles.dateSelect}
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                </select>
            </div>

            <div className={styles.tabContainer}>
                {['country', 'region', 'city'].map((tab) => (
                    <button
                        key={tab}
                        className={`${styles.tabButton} ${activeTab === tab ? styles.tabButtonActive : ''}`}
                        onClick={() => setActiveTab(tab)}
                        style={{ textTransform: 'capitalize' }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <DataTable columns={columns} data={data} loading={loading} />
        </div>
    );
}

function getFlagEmoji(countryCode: string) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}
