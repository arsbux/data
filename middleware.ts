import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    // Protect checkout - user must be logged in to pay
    if (pathname === '/checkout' || pathname.startsWith('/api/checkout')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Protect dashboard - requires auth + active subscription
    if (pathname.startsWith('/dashboard')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Check if user has active subscription
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('status')
            .eq('user_id', user.id)
            .single();

        if (!subscription || subscription.status !== 'active') {
            return NextResponse.redirect(new URL('/checkout', request.url));
        }
    }

    // Protect onboarding - requires auth
    if (pathname.startsWith('/onboarding')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Redirect authenticated users from login/signup
    if (pathname === '/login' || pathname === '/signup') {
        if (user) {
            // Check subscription status
            const { data: subscription } = await supabase
                .from('subscriptions')
                .select('status')
                .eq('user_id', user.id)
                .single();

            if (subscription?.status === 'active') {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            } else {
                // User authenticated but no subscription - send to checkout
                return NextResponse.redirect(new URL('/checkout', request.url));
            }
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|logo.png|api/webhooks|api/ingest|trackify.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
