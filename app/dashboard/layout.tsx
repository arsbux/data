import {
    LayoutDashboard,
    Globe,
    FileText,
    Link as LinkIcon,
    Map,
    Monitor,
    Plus,
    Layers
} from 'lucide-react';
import Link from 'next/link';
import styles from './dashboard.module.css';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .single();

    if (!subscription || subscription.status !== 'active') {
        redirect('/checkout');
    }

    // Fetch sites count to show in sidebar
    const { data: sites } = await supabase
        .from('sites')
        .select('id')
        .eq('user_id', user.id);

    const sitesCount = sites?.length || 0;

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
                    <Link href="/dashboard" className={styles.navItem}>
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link href="/dashboard/realtime" className={styles.navItem}>
                        <Globe size={20} />
                        Real-time
                    </Link>
                    <Link href="/dashboard/pages" className={styles.navItem}>
                        <FileText size={20} />
                        Pages
                    </Link>
                    <Link href="/dashboard/referrers" className={styles.navItem}>
                        <LinkIcon size={20} />
                        Referrers
                    </Link>
                    <Link href="/dashboard/locations" className={styles.navItem}>
                        <Map size={20} />
                        Locations
                    </Link>
                    <Link href="/dashboard/devices" className={styles.navItem}>
                        <Monitor size={20} />
                        Devices
                    </Link>
                    <div style={{ height: '1px', background: 'var(--border-primary)', margin: '1rem 0' }}></div>
                    <Link href="/dashboard/sites" className={styles.navItem}>
                        <Layers size={20} />
                        Sites
                        {sitesCount > 0 && (
                            <span style={{
                                marginLeft: 'auto',
                                background: 'var(--accent-primary)',
                                color: 'white',
                                fontSize: '0.75rem',
                                padding: '0.125rem 0.5rem',
                                borderRadius: '9999px',
                                fontWeight: 600
                            }}>
                                {sitesCount}
                            </span>
                        )}
                    </Link>
                    <Link href="/dashboard/add-site" className={styles.navItem}>
                        <Plus size={20} />
                        Add Site
                    </Link>
                </nav>
            </aside>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
