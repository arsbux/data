'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/dashboard/DataTable';
import styles from '../page.module.css';

export default function DevicesPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('7d');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/analytics/devices?range=${range}`);
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [range]);

    const columns = [
        {
            key: 'name',
            label: 'Device Type',
            render: (value: string) => <span style={{ textTransform: 'capitalize' }}>{value}</span>
        },
        { key: 'value', label: 'Percentage (%)' },
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
            <DataTable columns={columns} data={data} loading={loading} />
        </div>
    );
}
