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
                    <h1 className={styles.logo}>📊 Trackify</h1>
                </div>
                <nav className={styles.nav}>
                    <a href="/dashboard" className={styles.navItem}>
                        <span className={styles.navIcon}>📈</span>
                        Dashboard
                    </a>
                    <a href="/dashboard/realtime" className={styles.navItem}>
                        <span className={styles.navIcon}>🌍</span>
                        Real-time
                    </a>
                    <a href="/dashboard/pages" className={styles.navItem}>
                        <span className={styles.navIcon}>📄</span>
                        Pages
                    </a>
                    <a href="/dashboard/referrers" className={styles.navItem}>
                        <span className={styles.navIcon}>🔗</span>
                        Referrers
                    </a>
                    <a href="/dashboard/locations" className={styles.navItem}>
                        <span className={styles.navIcon}>🗺️</span>
                        Locations
                    </a>
                    <a href="/dashboard/devices" className={styles.navItem}>
                        <span className={styles.navIcon}>💻</span>
                        Devices
                    </a>
                </nav>
            </aside>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
