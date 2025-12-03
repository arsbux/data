'use client';

import styles from '@/app/dashboard/page.module.css';

interface Column {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    loading?: boolean;
}

export default function DataTable({ columns, data, loading }: DataTableProps) {
    if (loading) {
        return <div className={styles.emptyState}>Loading...</div>;
    }

    if (data.length === 0) {
        return <div className={styles.emptyState}>No data available</div>;
    }

    return (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-primary)', background: 'rgba(255,255,255,0.02)' }}>
                        {columns.map((col) => (
                            <th key={col.key} style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                            {columns.map((col) => (
                                <td key={col.key} style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
