import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { JWTPayload, jwtVerify, SignJWT } from 'jose';

/*
interface CustomJWTPayload {
  userId: string;
  email: string;
  name: string;
  picture: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiry: number;
  iat?: number;
  exp?: number;
}
  */

async function refreshAccessToken(refreshToken: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to refresh token: ${error.error_description || error.error}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in || 3600, // Default to 1 hour if not provided
  };
}

async function createNewJWT(payload: JWTPayload, newAccessToken: string, expiresIn: number) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  
  const newTokenExpiry = Date.now() + (expiresIn * 1000);
  
  return await new SignJWT({
    ...payload,
    accessToken: newAccessToken,
    tokenExpiry: newTokenExpiry,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

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
      try {
        console.log('Access token expired, refreshing...');
        
        // Refresh the access token
        const { accessToken: newAccessToken, expiresIn } = await refreshAccessToken(
          payload.refreshToken as string
        );

        // Create new JWT with updated access token
        const newJWT = await createNewJWT(payload, newAccessToken, expiresIn);

        // Set the new cookie
        const response = NextResponse.json({
          authenticated: true,
          tokenRefreshed: true,
          user: {
            id: payload.userId,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
          }
        });

        response.cookies.set('auth-token', newJWT, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60, // 24 hrs
          path: '/',
        });

        return response;

      } catch (error) {
        console.error('Failed to refresh token:', error);
        
        // Clear the invalid cookie
        const response = NextResponse.json({ 
          authenticated: false, 
          expired: true,
          error: 'Token refresh failed'
        }, { status: 401 });

        response.cookies.delete('auth-token');
        return response;
      }
    }

    // Token is still valid
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
    console.error('Auth verification error:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}