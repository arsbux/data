import React from 'react';

export default function PrivacyPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', color: '#fff' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' }}>Privacy Policy</h1>
            <div style={{ lineHeight: '1.6', color: '#ccc' }}>
                <p style={{ marginBottom: '1rem' }}>Last updated: {new Date().toLocaleDateString()}</p>
                <p style={{ marginBottom: '1rem' }}>
                    At Fast Data, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
                </p>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem', color: '#fff' }}>1. Information We Collect</h2>
                <p style={{ marginBottom: '1rem' }}>
                    We collect information you provide directly to us, such as when you create an account, and information we collect automatically when you use our services.
                </p>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem', color: '#fff' }}>2. How We Use Your Information</h2>
                <p style={{ marginBottom: '1rem' }}>
                    We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to protect our users.
                </p>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem', color: '#fff' }}>3. Data Security</h2>
                <p style={{ marginBottom: '1rem' }}>
                    We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.
                </p>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '2rem', marginBottom: '1rem', color: '#fff' }}>4. Contact Us</h2>
                <p style={{ marginBottom: '1rem' }}>
                    If you have any questions about this Privacy Policy, please contact us.
                </p>
            </div>
        </div>
    );
}
