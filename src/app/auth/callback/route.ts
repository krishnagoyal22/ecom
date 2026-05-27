import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const oauthError = requestUrl.searchParams.get('error_description') || requestUrl.searchParams.get('error');
  const nextParam = requestUrl.searchParams.get('next');
  const next = nextParam?.startsWith('/') ? nextParam : '/customer';

  if (oauthError) {
    const loginUrl = new URL('/login', requestUrl.origin);
    loginUrl.searchParams.set('error', oauthError);
    return NextResponse.redirect(loginUrl);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }

    const loginUrl = new URL('/login', requestUrl.origin);
    loginUrl.searchParams.set('error', error.message);
    return NextResponse.redirect(loginUrl);
  }

  const loginUrl = new URL('/login', requestUrl.origin);
  loginUrl.searchParams.set('error', 'Google sign in did not return a login code.');
  return NextResponse.redirect(loginUrl);
}
