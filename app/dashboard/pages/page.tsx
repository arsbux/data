'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/dashboard/DataTable';
import styles from '../page.module.css';

export default function PagesPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('7d');
    const [activeTab, setActiveTab] = useState('page');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/analytics/pages?range=${range}&type=${activeTab}`);
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
        { key: 'name', label: activeTab === 'hostname' ? 'Hostname' : 'Page Path' },
        { key: 'value', label: 'Visitors' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Top Pages</h1>
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
                {[
                    { id: 'hostname', label: 'Hostname' },
                    { id: 'page', label: 'Page' },
                    { id: 'entry_page', label: 'Entry page' },
                    { id: 'exit_page', label: 'Exit link' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <DataTable columns={columns} data={data} loading={loading} />
        </div>
    );
}
