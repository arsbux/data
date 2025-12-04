import { NextResponse } from 'next/server';

// This endpoint redirects to Dodo Payments hosted checkout pages
// No API call needed - just redirect to the checkout URL
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const plan = searchParams.get('plan') || 'lifetime';

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://data.flightlabs.agency';

    // Dodo Payments hosted checkout URLs (Live mode)
    const checkoutUrls: Record<string, string> = {
        monthly: process.env.DODO_MONTHLY_CHECKOUT_URL || 'https://checkout.dodopayments.com/buy/pdt_rCRoBUAxpCW5vqI1Sq40M',
        lifetime: process.env.DODO_LIFETIME_CHECKOUT_URL || 'https://checkout.dodopayments.com/buy/pdt_mK9zq3n6ynIfCckFzlbAB',
    };

    const checkoutUrl = checkoutUrls[plan];

    if (!checkoutUrl) {
        return NextResponse.json({
            error: `Invalid plan: ${plan}`
        }, { status: 400 });
    }

    // Add return URL as query param so Dodo knows where to redirect after payment
    const redirectUrl = `${checkoutUrl}?quantity=1&redirect_url=${encodeURIComponent(`${origin}/payment/success?plan=${plan}`)}`;

    return NextResponse.redirect(redirectUrl);
}
