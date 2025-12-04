'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from '../login/login.module.css';
import { Loader2 } from 'lucide-react';

function SignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const supabase = createClient();

        // Sign up the user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        if (!authData.user) {
            setError('Signup failed. Please try again.');
            setLoading(false);
            return;
        }

        // Check for pending subscription from webhook (if they paid before creating account)
        const { data: pendingSubscription } = await supabase
            .from('pending_subscriptions')
            .select('*')
            .eq('email', email)
            .single();

        if (pendingSubscription) {
            // Create subscription for this user from pending subscription
            await supabase.from('subscriptions').insert({
                user_id: authData.user.id,
                plan_type: pendingSubscription.plan_type,
                status: 'active',
                payment_id: pendingSubscription.payment_id,
            });

            // Delete the pending subscription
            await supabase
                .from('pending_subscriptions')
                .delete()
                .eq('email', email);

            // Redirect to dashboard (they already paid)
            router.push('/dashboard');
        } else {
            // No payment yet - redirect to checkout
            router.push('/checkout');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <img src="/logo.png" alt="Fast Data Logo" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
                        <h1 className={styles.logo}>Fast Data</h1>
                    </div>
                    <p className={styles.subtitle}>Create your account to get started</p>
                </div>

                <form onSubmit={handleSignup} className={styles.form}>
                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    <div className={styles.field}>
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="new-password"
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Already have an account? <a href="/login" className={styles.link}>Sign in</a></p>
                </div>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={32} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
        }>
            <SignupForm />
        </Suspense>
    );
}
