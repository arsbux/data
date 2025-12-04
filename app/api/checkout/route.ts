import { createClient } from '@/lib/supabase/server';
import { dodo } from '@/lib/dodo';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await req.json();

    // Dodo Payments usually expects amount in smallest currency unit (cents)
    const amount = plan === 'monthly' ? 900 : 3900;
    const productName = plan === 'monthly' ? 'Fast Data Monthly' : 'Fast Data Lifetime';

    try {
        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const payment: any = await dodo.payments.create({
            amount,
            currency: 'USD',
            product_name: productName,
            customer: {
                email: user.email || '',
                name: user.user_metadata.full_name || '',
            },
            return_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
            metadata: {
                user_id: user.id,
                plan_type: plan
            }
        } as any);

        return NextResponse.json({ url: payment.checkout_url });
    } catch (error: any) {
        console.error('Payment creation error:', error);
        return NextResponse.json({ error: error.message || 'Payment creation failed' }, { status: 500 });
    }
}
