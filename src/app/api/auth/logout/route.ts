// /app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  // Clear the auth-token cookie
  const response = NextResponse.json({ message: 'Logged out' });
  
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0, 
  });

  return response;
}
