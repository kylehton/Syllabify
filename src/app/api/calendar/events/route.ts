import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

import { EventItem } from '../../../dashboard/types/events'

interface GoogleCalendarEvent {
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
  description?: string;
}

function mapDateToEvent(item: EventItem): GoogleCalendarEvent {
  const dueDate = new Date(item.date); // the due date
  const startDate = new Date(dueDate);
  startDate.setDate(dueDate.getDate() - 1); // day before

  // Set start at 00:00 and end at 23:59 on the day before
  const startDateTime = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
    0, 0, 0
  ).toISOString();

  const endDateTime = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
    23, 59, 0
  ).toISOString();

  return {
    summary: item.name,
    start: { dateTime: startDateTime }, // adjust timezone as needed
    end: { dateTime: endDateTime },
    description: `Type: ${item.type}`
  };
}


async function getAccessToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) throw new Error('No auth token');

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const { payload } = await jwtVerify(token, secret);

  return payload.accessToken as string;
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    const tokenInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
    const tokenInfo = await tokenInfoResponse.json();
    console.log('Token info:', tokenInfo);

    if (tokenInfo.error) {
      console.log('Token is invalid/expired:', tokenInfo.error);
   
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
    const events = await request.json();

    await Promise.all(
      events.map(async (eventData: EventItem) => {
        const mappedEvent = mapDateToEvent(eventData)
        const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mappedEvent),
        });
    
        if (!response.ok) {
          console.error('Failed to create event', await response.text());
        }
      })
    )
    return NextResponse.json({success: "All events uploaded"}, {status: 200})

  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}