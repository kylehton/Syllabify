import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.AUTH_URL}/api/google/auth/login/callback`;
  
  if (!clientId) {
    return NextResponse.json({ error: 'Google client ID not configured' }, { status: 500 });
  }

  const scope = 'https://www.googleapis.com/auth/calendar.events openid email profile';
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    access_type: 'offline',
    prompt: 'select_account',
    state: 'random-state-value', // Use crypto.randomUUID() in production
  })}`;

  return NextResponse.redirect(authUrl);
}