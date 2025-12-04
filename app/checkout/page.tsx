'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime' | null>(
        (searchParams.get('plan') as 'monthly' | 'lifetime') || null
    );

    const handleCheckout = async (plan: 'monthly' | 'lifetime') => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan }),
            });
            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Failed to create checkout session');
            }
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-4">Select a Plan</h1>
                    <p className="text-gray-400">Choose a subscription to access Fast Data</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-8 text-center">
                        {error}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Monthly Plan */}
                    <div
                        className={`p-8 rounded-2xl border transition-all cursor-pointer ${selectedPlan === 'monthly'
                                ? 'bg-white/10 border-blue-500 ring-2 ring-blue-500/20'
                                : 'bg-white/5 border-white/10 hover:border-white/20'
                            }`}
                        onClick={() => setSelectedPlan('monthly')}
                    >
                        <h3 className="text-xl font-semibold mb-2">Monthly</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold">$9</span>
                            <span className="text-gray-400">/month</span>
                        </div>
                        <ul className="space-y-3 mb-8 text-gray-300 text-sm">
                            <li className="flex gap-2"><Check className="w-4 h-4 text-blue-400" /> Unlimited websites</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-blue-400" /> 100k pageviews/mo</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-blue-400" /> Cancel anytime</li>
                        </ul>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCheckout('monthly');
                            }}
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && selectedPlan === 'monthly' && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading && selectedPlan === 'monthly' ? 'Processing...' : 'Subscribe Monthly'}
                        </button>
                    </div>

                    {/* Lifetime Plan */}
                    <div
                        className={`p-8 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${selectedPlan === 'lifetime'
                                ? 'bg-blue-900/20 border-blue-500 ring-2 ring-blue-500/20'
                                : 'bg-white/5 border-white/10 hover:border-blue-500/30'
                            }`}
                        onClick={() => setSelectedPlan('lifetime')}
                    >
                        <div className="absolute top-0 right-0 bg-blue-600 text-xs font-bold px-3 py-1 rounded-bl-xl">
                            BEST VALUE
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-blue-400">Lifetime Deal</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold">$39</span>
                            <span className="text-gray-400">/one-time</span>
                        </div>
                        <ul className="space-y-3 mb-8 text-gray-300 text-sm">
                            <li className="flex gap-2"><Check className="w-4 h-4 text-blue-400" /> Unlimited everything</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-blue-400" /> Lifetime access</li>
                            <li className="flex gap-2"><Check className="w-4 h-4 text-blue-400" /> One-time payment</li>
                        </ul>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCheckout('lifetime');
                            }}
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && selectedPlan === 'lifetime' && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading && selectedPlan === 'lifetime' ? 'Processing...' : 'Get Lifetime Access'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
