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

    const maxValue = Math.max(...data.map(d => d.value || 0), 0);

    return (
        <div className="glass-card" style={{ padding: '1rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-primary)', marginBottom: '1rem' }}>
                {columns.map((col, i) => (
                    <div
                        key={col.key}
                        style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                            textAlign: i === columns.length - 1 ? 'right' : 'left',
                            flex: i === 0 ? 1 : undefined,
                            minWidth: i === columns.length - 1 ? '100px' : undefined
                        }}
                    >
                        {col.label}
                    </div>
                ))}
            </div>

            {/* Rows */}
            <div className={styles.dataList}>
                {data.map((row, i) => {
                    const percent = maxValue > 0 ? ((row.value || 0) / maxValue) * 100 : 0;

                    return (
                        <div key={i} className={styles.dataItem}>
                            <div
                                className={styles.dataBar}
                                style={{ width: `${percent}%` }}
                            />
                            <div className={styles.dataContent}>
                                {columns.map((col, j) => (
                                    <div
                                        key={col.key}
                                        style={{
                                            flex: j === 0 ? 1 : undefined,
                                            textAlign: j === columns.length - 1 ? 'right' : 'left',
                                            minWidth: j === columns.length - 1 ? '100px' : undefined,
                                            zIndex: 2,
                                            // Apply specific styles based on column type
                                            fontSize: '0.875rem',
                                            color: j === columns.length - 1 ? 'var(--text-primary)' : 'var(--text-primary)',
                                            fontWeight: j === columns.length - 1 ? 600 : 400,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
