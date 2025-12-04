'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from '../login/login.module.css';
import { Loader2 } from 'lucide-react';

function SignupForm() {
    const searchParams = useSearchParams();
    const prefillEmail = searchParams.get('email') || '';
    const plan = searchParams.get('plan');
    const paymentId = searchParams.get('payment_id');

    const [email, setEmail] = useState(prefillEmail);
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (prefillEmail) {
            setEmail(prefillEmail);
        }
    }, [prefillEmail]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const supabase = createClient();
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

        // If user has a payment_id (came from successful payment), create subscription
        if (paymentId && plan && authData.user) {
            const { error: subError } = await supabase.from('subscriptions').insert({
                user_id: authData.user.id,
                plan_type: plan,
                status: 'active',
                payment_id: paymentId,
            });

            if (subError) {
                console.error('Failed to create subscription:', subError);
            }
        }

        // Redirect to onboarding or checkout based on payment status
        if (paymentId && plan) {
            router.push('/onboarding');
        } else {
            router.push('/pricing');
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
                    {paymentId && plan ? (
                        <p className={styles.subtitle} style={{ color: '#22c55e' }}>
                            ✓ Payment received! Create your account to get started.
                        </p>
                    ) : (
                        <p className={styles.subtitle}>Create your account to get started</p>
                    )}
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
                            disabled={!!prefillEmail}
                            style={prefillEmail ? { backgroundColor: 'rgba(255,255,255,0.05)', cursor: 'not-allowed' } : {}}
                        />
                        {prefillEmail && (
                            <small style={{ color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                                Use the email you paid with
                            </small>
                        )}
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
                    {!paymentId && (
                        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                            Need to purchase first? <a href="/pricing" className={styles.link}>View pricing</a>
                        </p>
                    )}
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
