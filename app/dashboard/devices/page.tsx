'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/dashboard/DataTable';
import styles from '../page.module.css';

export default function DevicesPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('7d');
    const [activeTab, setActiveTab] = useState('device');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/analytics/devices?range=${range}&type=${activeTab}`);
                const json = await res.json();
                // Map count to value for bar visualization
                const mappedData = json.map((item: any) => ({
                    ...item,
                    value: item.count, // Use count for bar width and display
                    percentage: item.value // Keep percentage if needed
                }));
                setData(mappedData);
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
            label: activeTab === 'os' ? 'OS' : activeTab === 'browser' ? 'Browser' : 'Device',
            render: (value: string) => <span style={{ textTransform: 'capitalize' }}>{value}</span>
        },
        { key: 'value', label: 'Visitors' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Devices</h1>
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
                {['device', 'browser', 'os'].map((tab) => (
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
