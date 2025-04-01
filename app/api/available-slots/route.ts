import { NextResponse } from 'next/server';

async function fetchCalendarEvents(date: Date) {
  const username = process.env.CALDAV_USERNAME;
  const password = process.env.CALDAV_PASSWORD;
  const calendarUrl = 'https://zimbra1.mail.ovh.net/dav/contact@bitsway.fr/Calendar/';

  console.log('Fetching calendar events for date:', date.toISOString());
  console.log('Using credentials:', { username, password: '***' });

  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const reportXml = `<?xml version="1.0" encoding="utf-8" ?>
    <C:calendar-query xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
      <D:prop>
        <D:getetag/>
        <C:calendar-data/>
      </D:prop>
      <C:filter>
        <C:comp-filter name="VCALENDAR">
          <C:comp-filter name="VEVENT">
            <C:time-range start="${startDate.toISOString()}" end="${endDate.toISOString()}"/>
          </C:comp-filter>
        </C:comp-filter>
      </C:filter>
    </C:calendar-query>`;

  try {
    console.log('Sending CalDAV request to:', calendarUrl);
    const response = await fetch(calendarUrl, {
      method: 'REPORT',
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Depth': '1',
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0',
      },
      body: reportXml,
    });

    console.log('CalDAV response status:', response.status);
    const responseText = await response.text();
    console.log('CalDAV response:', responseText);

    if (!response.ok) {
      throw new Error(`CalDAV request failed: ${response.status} - ${responseText}`);
    }

    return parseCalendarData(responseText);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
}

function parseCalendarData(calendarData: string): { start: Date; end: Date }[] {
  // Extraire les événements du XML CalDAV
  const events: { start: Date; end: Date }[] = [];
  const eventMatches = calendarData.match(/<vevent>[\s\S]*?<\/vevent>/g) || [];

  for (const eventXml of eventMatches) {
    const startMatch = eventXml.match(/<dtstart[^>]*>(.*?)<\/dtstart>/);
    const endMatch = eventXml.match(/<dtend[^>]*>(.*?)<\/dtend>/);

    if (startMatch && endMatch) {
      events.push({
        start: new Date(startMatch[1]),
        end: new Date(endMatch[1]),
      });
    }
  }

  return events;
}

function generateAvailableSlots(date: Date, busySlots: { start: Date; end: Date }[]) {
  const slots = [];
  const workStart = 9; // 9h
  const workEnd = 18; // 18h

  for (let hour = workStart; hour < workEnd; hour++) {
    const slotStart = new Date(date);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(date);
    slotEnd.setHours(hour + 1, 0, 0, 0);

    // Vérifier si le créneau est disponible
    const isAvailable = !busySlots.some(busy => {
      const busyStart = new Date(busy.start);
      const busyEnd = new Date(busy.end);
      return (
        (slotStart >= busyStart && slotStart < busyEnd) ||
        (slotEnd > busyStart && slotEnd <= busyEnd) ||
        (slotStart <= busyStart && slotEnd >= busyEnd)
      );
    });

    if (isAvailable) {
      slots.push({
        time: slotStart.toISOString(),
        label: `${hour.toString().padStart(2, '0')}:00`,
      });
    }
  }

  return slots;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    if (!dateParam) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    const date = new Date(dateParam);
    const busySlots = await fetchCalendarEvents(date);
    const availableSlots = generateAvailableSlots(date, busySlots);

    return NextResponse.json({ slots: availableSlots });
  } catch (error) {
    console.error('Error getting available slots:', error);
    return NextResponse.json(
      { error: 'Failed to get available slots' },
      { status: 500 }
    );
  }
} 