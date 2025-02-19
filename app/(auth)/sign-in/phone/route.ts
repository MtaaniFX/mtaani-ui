"use server"

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createSuperClient } from '@supabase/supabase-js'

const secretSupabase = createSuperClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function getUserEmail(user_id: string)  {
    const { data, error } = await secretSupabase.auth.admin.getUserById(user_id);
    if (error) {
        return "";
    }
    return data.user.email || "";
}

export async function POST(req: NextRequest) {
    const { phone_number, password } = await req.json();

    if (!phone_number || !password) {
        return NextResponse.json({ error: 'Phone number and password are required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Fetch the user associated with the phone number
    const { data, error } = await supabase
        .schema('app_phone')
        .from('phone_numbers')
        .select('user_id, is_verified')
        .eq('phone_number', phone_number)
        .order('phone_confirmed_at', { ascending: false })
        .limit(1)
        .single();

    if (error || !data) {
        return NextResponse.json({ error: 'Invalid phone number or password' }, { status: 400 });
    }

    if (!data.is_verified) {
        return NextResponse.json({ error: 'Phone number not verified' }, { status: 403 });
    }

    // Attempt to sign in with the retrieved email and provided password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: await getUserEmail(data.user_id),
        password,
    });

    if (authError || !authData.session) {
        return NextResponse.json({ error: 'Invalid phone number or password' }, { status: 400 });
    }

    // Set the auth session in cookies
    const response = NextResponse.json(authData, { status: 200 });

    // authData.session.access_token

    // response.cookies.set('access-token', authData.session.access_token, {
    //     path: '/',
    //     httpOnly: true,
    //     // secure: true,
    //     sameSite: 'lax',
    // });

    // response.cookies.set('refresh-token', authData.session.refresh_token, {
    //     path: '/',
    //     httpOnly: true,
    //     // secure: true,
    //     sameSite: 'lax',
    // });

    return response;
}
