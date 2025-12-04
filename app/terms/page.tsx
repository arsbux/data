import React from 'react';

export default function TermsPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', color: '#fff' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>Terms of Service</h1>
            <div style={{ lineHeight: '1.6', color: '#ccc' }}>
                <p style={{ marginBottom: '1rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
                <p style={{ marginBottom: '1rem' }}>
                    Welcome to Fast Data. By accessing or using our website and services, you agree to be bound by these Terms of Service and our Privacy Policy.
                </p>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem', color: '#fff' }}>1. Use of Service</h2>
                <p style={{ marginBottom: '1rem' }}>
                    Fast Data provides web analytics services. You agree to use the service only for lawful purposes and in accordance with these Terms.
                </p>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem', color: '#fff' }}>2. Account Responsibilities</h2>
                <p style={{ marginBottom: '1rem' }}>
                    You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem', color: '#fff' }}>3. Data Privacy</h2>
                <p style={{ marginBottom: '1rem' }}>
                    We respect your data privacy. Please refer to our Privacy Policy for information on how we collect, use, and disclose information.
                </p>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem', color: '#fff' }}>4. Changes to Terms</h2>
                <p style={{ marginBottom: '1rem' }}>
                    We reserve the right to modify these terms at any time. We will notify users of any significant changes.
                </p>
            </div>
        </div>
    );
}
