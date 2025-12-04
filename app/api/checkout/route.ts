import { dodo } from '@/lib/dodo';
import { NextResponse } from 'next/server';

// This endpoint creates a Dodo Payments checkout session and redirects to their hosted page
// No auth required - user pays first, then creates account after payment success
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const plan = searchParams.get('plan') || 'lifetime';

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // You need to create these products in your Dodo Payments Dashboard
    // and replace these IDs with your actual product IDs
    const productIds: Record<string, string> = {
        monthly: process.env.DODO_MONTHLY_PRODUCT_ID || 'prod_monthly_placeholder',
        lifetime: process.env.DODO_LIFETIME_PRODUCT_ID || 'prod_lifetime_placeholder',
    };

    try {
        // Create a checkout session using Dodo Payments SDK
        const session: any = await dodo.payments.create({
            billing: {
                city: '',
                country: 'US',
                state: '',
                street: '',
                zipcode: '',
            },
            customer: {
                email: '', // Dodo will collect this on their hosted checkout
                name: '',
            },
            product_cart: [
                {
                    product_id: productIds[plan],
                    quantity: 1,
                }
            ],
            return_url: `${origin}/payment/success?plan=${plan}`,
            metadata: {
                plan_type: plan,
            }
        } as any);

        // Redirect to Dodo's hosted checkout page
        if (session.payment_link) {
            return NextResponse.redirect(session.payment_link);
        }

        // Fallback if payment_link not returned
        return NextResponse.json({ error: 'Could not create checkout session' }, { status: 500 });
    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 });
    }
}
