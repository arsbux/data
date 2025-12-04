import { NextResponse } from 'next/server';

// This endpoint creates a Dodo Payments checkout session and redirects to their hosted page
// No auth required - user pays first, then creates account after payment success
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const plan = searchParams.get('plan') || 'lifetime';

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const apiKey = process.env.DODO_PAYMENTS_API_KEY;

    // Check if API key is configured
    if (!apiKey) {
        console.error('DODO_PAYMENTS_API_KEY is not set');
        return NextResponse.json({
            error: 'Payment system not configured. Please set DODO_PAYMENTS_API_KEY in environment variables.'
        }, { status: 500 });
    }

    // You need to create these products in your Dodo Payments Dashboard
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
        // Use fetch directly to call Dodo Payments API
        const response = await fetch('https://api.dodopayments.com/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                billing: {
                    city: 'New York',
                    country: 'US',
                    state: 'NY',
                    street: '123 Main St',
                    zipcode: '10001',
                },
                customer: {
                    email: 'customer@example.com', // Dodo will prompt user for real email
                    name: 'Customer',
                },
                product_cart: [
                    {
                        product_id: productIds[plan],
                        quantity: 1,
                    }
                ],
                return_url: `${origin}/payment/success?plan=${plan}`,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Dodo API error:', response.status, errorData);
            return NextResponse.json({
                error: `Dodo API error: ${response.status}`,
                details: errorData
            }, { status: response.status });
        }

        const payment = await response.json();
        console.log('Payment created:', payment);

        // Redirect to Dodo's hosted checkout page
        if (payment.payment_link) {
            return NextResponse.redirect(payment.payment_link);
        }

        // Fallback - return the payment data for debugging
        return NextResponse.json({
            message: 'Payment created but no payment_link returned',
            payment
        });
    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 });
    }
}
