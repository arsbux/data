import { dodo } from '@/lib/dodo';
import { NextResponse } from 'next/server';

// This endpoint creates a Dodo Payments checkout session and redirects to their hosted page
// No auth required - user pays first, then creates account after payment success
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const plan = searchParams.get('plan') || 'lifetime';

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Check if API key is configured
    if (!process.env.DODO_PAYMENTS_API_KEY) {
        console.error('DODO_PAYMENTS_API_KEY is not set');
        return NextResponse.json({
            error: 'Payment system not configured. Please set DODO_PAYMENTS_API_KEY in environment variables.'
        }, { status: 500 });
    }

    // You need to create these products in your Dodo Payments Dashboard
    // and replace these IDs with your actual product IDs
    const productIds: Record<string, string> = {
        monthly: process.env.DODO_MONTHLY_PRODUCT_ID || '',
        lifetime: process.env.DODO_LIFETIME_PRODUCT_ID || '',
    };

    if (!productIds[plan]) {
        console.error(`Product ID not configured for plan: ${plan}`);
        return NextResponse.json({
            error: `Product ID not configured for ${plan} plan. Please set DODO_${plan.toUpperCase()}_PRODUCT_ID in environment variables.`
        }, { status: 500 });
    }

    try {
        // Create a payment using Dodo Payments SDK
        const payment: any = await dodo.payments.create({
            billing: {
                city: '',
                country: 'US',
                state: '',
                street: '',
                zipcode: '',
            },
            customer: {
                email: '',
                name: '',
            },
            product_cart: [
                {
                    product_id: productIds[plan],
                    quantity: 1,
                }
            ],
            return_url: `${origin}/payment/success?plan=${plan}`,
        } as any);

        // Redirect to Dodo's hosted checkout page
        if (payment.payment_link) {
            return NextResponse.redirect(payment.payment_link);
        }

        // Fallback - return the payment data
        return NextResponse.json(payment);
    } catch (error: any) {
        console.error('Checkout error:', error);

        // Parse error message
        let errorMessage = 'Checkout failed';
        if (error.message) {
            errorMessage = error.message;
        } else if (error.status === 401) {
            errorMessage = 'Invalid API key. Please check DODO_PAYMENTS_API_KEY.';
        } else if (error.status === 404) {
            errorMessage = 'Product not found. Please check your product IDs.';
        }

        return NextResponse.json({ error: errorMessage }, { status: error.status || 500 });
    }
}
