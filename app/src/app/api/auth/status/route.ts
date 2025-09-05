import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    // Check if access token is expired
    const tokenExpiry = payload.tokenExpiry as number;
    const isExpired = Date.now() > tokenExpiry;

    if (isExpired && payload.refreshToken) {
      // Refresh the token (implement refresh logic here)
      // For now, return expired status
      return NextResponse.json({ 
        authenticated: false, 
        expired: true 
      }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      }
    });

  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}