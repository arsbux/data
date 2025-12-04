import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const CreateSiteSchema = z.object({
    domain: z.string().min(1, "Domain is required").transform(val => {
        try {
            // Try to construct a URL to extract hostname, otherwise assume it's a hostname
            if (!val.startsWith('http')) {
                return new URL(`https://${val}`).hostname;
            }
            return new URL(val).hostname;
        } catch {
            return val;
        }
    }),
    name: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validated = CreateSiteSchema.parse(body);

        const supabase = await createClient();

        // Generate a clean site ID from domain
        const siteId = validated.domain.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '-' + Math.random().toString(36).substring(2, 7);
        const name = validated.name || validated.domain;

        const { data, error } = await supabase
            .from('sites')
            .insert({
                domain: validated.domain,
                name: name,
                site_id: siteId,
                // user_id is nullable, leaving it null for now as auth is disabled
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating site:', error);
            return NextResponse.json({ error: 'Failed to create site' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            site: data,
            trackingCode: `<script defer src="${new URL(request.url).origin}/trackify.js" data-site-id="${data.site_id}"></script>`
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: (error as any).errors[0].message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
