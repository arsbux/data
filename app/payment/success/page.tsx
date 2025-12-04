'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const plan = searchParams.get('plan') || 'lifetime';
    const paymentId = searchParams.get('payment_id');
    const email = searchParams.get('email');

    const [loading, setLoading] = useState(false);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#000',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{ maxWidth: '480px', textAlign: 'center' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 2rem'
                }}>
                    <CheckCircle size={40} color="#22c55e" />
                </div>

                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Payment Successful!
                </h1>

                <p style={{ color: '#9ca3af', marginBottom: '2rem', lineHeight: 1.6 }}>
                    Thank you for purchasing Fast Data {plan === 'lifetime' ? 'Lifetime' : 'Monthly'}!
                    {email && <><br />A confirmation has been sent to <strong style={{ color: '#fff' }}>{email}</strong>.</>}
                </p>

                <div style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    textAlign: 'left'
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Next Steps:</h3>
                    <ol style={{ margin: 0, paddingLeft: '1.25rem', color: '#d1d5db', lineHeight: 1.8 }}>
                        <li>Create your account using the email you paid with</li>
                        <li>Add your first website to track</li>
                        <li>Install the tracking script on your site</li>
                        <li>Start seeing real-time analytics!</li>
                    </ol>
                </div>

                <Link
                    href={`/signup${email ? `?email=${encodeURIComponent(email)}&plan=${plan}&payment_id=${paymentId || ''}` : ''}`}
                    style={{
                        display: 'inline-block',
                        padding: '1rem 2rem',
                        backgroundColor: '#2563eb',
                        color: '#fff',
                        borderRadius: '12px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        marginBottom: '1rem'
                    }}
                >
                    Create Your Account
                </Link>

                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Already have an account? <Link href="/login" style={{ color: '#60a5fa', textDecoration: 'none' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#000',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
