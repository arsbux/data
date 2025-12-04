import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Webhook handler for Dodo Payments events
export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get('webhook-signature') || '';

    // Verify webhook signature (using Dodo's webhook secret)
    const webhookSecret = process.env.DODO_WEBHOOK_SECRET;

    if (webhookSecret) {
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('hex');

        if (signature !== expectedSignature) {
            console.error('Invalid webhook signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }
    }

    const event = JSON.parse(body);

    console.log('Dodo Webhook Event:', event.type);

    const supabase = await createClient();

    switch (event.type) {
        case 'payment.succeeded':
        case 'payment_intent.succeeded': {
            const payment = event.data;
            const email = payment.customer?.email;
            const planType = payment.metadata?.plan_type || 'lifetime';
            const paymentId = payment.id || payment.payment_id;

            if (email) {
                // Check if user exists
                const { data: existingUser } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('email', email)
                    .single();

                if (existingUser) {
                    // Update or create subscription for existing user
                    await supabase.from('subscriptions').upsert({
                        user_id: existingUser.id,
                        plan_type: planType,
                        status: 'active',
                        payment_id: paymentId,
                        updated_at: new Date().toISOString(),
                    }, { onConflict: 'user_id' });
                }

                // Store pending subscription for when user signs up
                await supabase.from('pending_subscriptions').upsert({
                    email: email,
                    plan_type: planType,
                    payment_id: paymentId,
                    created_at: new Date().toISOString(),
                }, { onConflict: 'email' });
            }

            break;
        }

        case 'subscription.created':
        case 'subscription.updated': {
            const subscription = event.data;
            const email = subscription.customer?.email;
            const status = subscription.status === 'active' ? 'active' : 'cancelled';

            if (email) {
                const { data: user } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('email', email)
                    .single();

                if (user) {
                    await supabase.from('subscriptions').upsert({
                        user_id: user.id,
                        plan_type: 'monthly',
                        status: status,
                        payment_id: subscription.id,
                        updated_at: new Date().toISOString(),
                    }, { onConflict: 'user_id' });
                }
            }
            break;
        }

        case 'subscription.cancelled': {
            const subscription = event.data;
            const email = subscription.customer?.email;

            if (email) {
                const { data: user } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('email', email)
                    .single();

                if (user) {
                    await supabase.from('subscriptions').update({
                        status: 'cancelled',
                        updated_at: new Date().toISOString(),
                    }).eq('user_id', user.id);
                }
            }
            break;
        }

        default:
            console.log('Unhandled webhook event:', event.type);
    }

    return NextResponse.json({ received: true });
}
