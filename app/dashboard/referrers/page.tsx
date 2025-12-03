'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/dashboard/DataTable';
import styles from '../page.module.css';

export default function ReferrersPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('7d');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/analytics/referrers?range=${range}`);
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
        { key: 'name', label: 'Source' },
        { key: 'value', label: 'Visitors' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Top Referrers</h1>
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
