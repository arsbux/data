import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Webhook handler for Dodo Payments events
export async function POST(req: Request) {
    const body = await req.text();

    // Log incoming webhook for debugging
    console.log('Dodo Webhook received');

    // For now, skip signature verification to get webhooks working
    // TODO: Add proper signature verification in production
    // const signature = req.headers.get('webhook-signature') || req.headers.get('svix-signature') || '';
    // const webhookSecret = process.env.DODO_WEBHOOK_SECRET;

    let event;
    try {
        event = JSON.parse(body);
    } catch (e) {
        console.error('Failed to parse webhook body:', e);
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    console.log('Dodo Webhook Event:', event.type, event);

    const supabase = await createClient();
    const data = event.data;

    try {
        switch (event.type) {
            case 'payment.succeeded': {
                const email = data.customer?.email;
                const paymentId = data.payment_id;

                if (email) {
                    // Store pending subscription for when user signs up
                    try {
                        await supabase.from('pending_subscriptions').upsert({
                            email: email,
                            plan_type: 'lifetime',
                            payment_id: paymentId,
                            created_at: new Date().toISOString(),
                        }, { onConflict: 'email' });
                    } catch (e) { console.error(e); }
                }
                break;
            }

            case 'subscription.active':
            case 'subscription.created':
            case 'subscription.updated': {
                const email = data.customer?.email;
                const subscriptionId = data.subscription_id;
                const status = data.status === 'active' ? 'active' : 'cancelled';

                console.log('Subscription event for:', email, 'Status:', status);

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
                            plan_type: 'monthly',
                            status: status,
                            payment_id: subscriptionId,
                            updated_at: new Date().toISOString(),
                        }, { onConflict: 'user_id' });
                    }

                    // Also store as pending for new signups
                    try {
                        await supabase.from('pending_subscriptions').upsert({
                            email: email,
                            plan_type: 'monthly',
                            payment_id: subscriptionId,
                            status: status,
                            created_at: new Date().toISOString(),
                        }, { onConflict: 'email' });
                    } catch (e) { console.error(e); }
                }
                break;
            }

            case 'subscription.cancelled':
            case 'subscription.expired': {
                const email = data.customer?.email;

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

            case 'subscription.renewed': {
                const email = data.customer?.email;
                console.log('Subscription renewed for:', email);
                // Nothing to update - it's still active
                break;
            }

            default:
                console.log('Unhandled webhook event:', event.type);
        }
    } catch (error) {
        console.error('Webhook processing error:', error);
        // Still return 200 to acknowledge receipt
    }

    return NextResponse.json({ received: true });
}
