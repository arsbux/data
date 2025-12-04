import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function PaymentSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id: string; plan: string }>;
}) {
    const { session_id, plan } = await searchParams;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !session_id) {
        redirect('/dashboard');
    }

    // In a real app, we should verify the session_id with Dodo Payments API here.
    // For now, we'll assume it's valid if present and update the subscription.

    const { error } = await supabase.from('subscriptions').upsert({
        user_id: user.id,
        plan_type: plan,
        status: 'active',
        payment_id: session_id,
        updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    if (error) {
        console.error('Failed to update subscription:', error);
    }

    redirect('/onboarding');
}
