import {
    LayoutDashboard,
    Globe,
    FileText,
    Link as LinkIcon,
    Map,
    Monitor,
    Plus
} from 'lucide-react';
import styles from './dashboard.module.css';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src="/logo.png" alt="Fast Data Logo" style={{ width: '24px', height: '24px', borderRadius: '4px' }} />
                        <h1 className={styles.logo}>Fast Data</h1>
                    </div>
                </div>
                <nav className={styles.nav}>
                    <a href="/dashboard" className={styles.navItem}>
                        <LayoutDashboard size={20} />
                        Dashboard
                    </a>
                    <a href="/dashboard/realtime" className={styles.navItem}>
                        <Globe size={20} />
                        Real-time
                    </a>
                    <a href="/dashboard/pages" className={styles.navItem}>
                        <FileText size={20} />
                        Pages
                    </a>
                    <a href="/dashboard/referrers" className={styles.navItem}>
                        <LinkIcon size={20} />
                        Referrers
                    </a>
                    <a href="/dashboard/locations" className={styles.navItem}>
                        <Map size={20} />
                        Locations
                    </a>
                    <a href="/dashboard/devices" className={styles.navItem}>
                        <Monitor size={20} />
                        Devices
                    </a>
                    <div style={{ height: '1px', background: 'var(--border-primary)', margin: '1rem 0' }}></div>
                    <a href="/dashboard/add-site" className={styles.navItem}>
                        <Plus size={20} />
                        Add Site
                    </a>
                </nav>
            </aside>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
