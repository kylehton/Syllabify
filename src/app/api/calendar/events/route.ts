import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

async function getAccessToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) throw new Error('No auth token');

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const { payload } = await jwtVerify(token, secret);

  return payload.accessToken as string;
}

async function updateAccessToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) throw new Error("No auth token");

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const { payload } = await jwtVerify(token, secret);

}

async function getRefreshToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) throw new Error('No auth token');

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const { payload } = await jwtVerify(token, secret);

  return payload.refreshToken as string;
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();

        // Test the token validity
    const tokenInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
    const tokenInfo = await tokenInfoResponse.json();
    console.log('Token info:', tokenInfo);

    if (tokenInfo.error) {
      console.log('Token is invalid/expired:', tokenInfo.error);
      const refToken = await getRefreshToken()
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          grant_type: "refresh_token",
          refresh_token: refToken,
        }),
      });
      const updatedToken = await tokenResponse.json()
      console.log("updated:", updatedToken)
      
    } else {
      console.log('Token expires in:', tokenInfo.expires_in, 'seconds');
      console.log('Token scope:', tokenInfo.scope);
    }

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      // More specific error handling
      const errorText = await response.text();
      console.error(`Google Calendar API error: ${response.status} ${response.statusText}`, errorText);
      
      throw new Error(`Failed to fetch calendar events: ${response.status} ${response.statusText}`);
    }
    
    const events = await response.json();
    console.log("Events 1:", events)
    
    return NextResponse.json({events: events});
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: `Unauthorized` }, { status: 401 });
}
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();
    const eventData = await request.json();

    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error('Failed to create calendar event');
    }
    else {
      console.log("Response is OK")
    }


    const event = await response.json();
    return NextResponse.json(event);

  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}