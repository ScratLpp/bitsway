import { NextResponse } from 'next/server';
import { generateAvailableSlots } from '@/app/utils/calendar';

interface CalendarEvent {
  start: Date;
  end: Date;
}

function formatDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
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

    console.log('\n=== Nouvelle requête de créneaux disponibles ===');
    console.log('Date reçue:', dateParam);
    const date = new Date(dateParam);
    
    // S'assurer que la date est en UTC
    const utcDate = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    ));
    
    console.log('Date convertie en UTC:', utcDate.toISOString());
    
    const busySlots = await fetchCalendarEvents(utcDate);
    console.log('Créneaux occupés récupérés:', busySlots.map(slot => ({
      start: slot.start.toISOString(),
      end: slot.end.toISOString()
    })));
    
    const availableSlots = generateAvailableSlots(utcDate, busySlots);
    console.log('Créneaux disponibles générés:', availableSlots);
    console.log('=== Fin de la requête ===\n');

    return NextResponse.json({ slots: availableSlots });
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux disponibles:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get available slots' },
      { status: 500 }
    );
  }
}

export async function fetchCalendarEvents(date: Date): Promise<CalendarEvent[]> {
  const calendarUrl = process.env.CALDAV_CALENDAR_URL;
  const username = process.env.CALDAV_USERNAME;
  const password = process.env.CALDAV_PASSWORD;

  if (!calendarUrl || !username || !password) {
    console.error('CalDAV credentials not configured');
    return [];
  }

  // Créer les dates de début et de fin pour le jour spécifié
  const startDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - 1, 23, 59, 59));

  console.log('Fetching events for date:', date.toISOString());
  console.log('Start date:', startDate.toISOString());
  console.log('End date:', endDate.toISOString());

  try {
    // Vérifier l'accès au calendrier
    const propfindResponse = await fetch(calendarUrl, {
      method: 'PROPFIND',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        'Depth': '0',
        'Content-Type': 'application/xml',
      },
      body: `<?xml version="1.0" encoding="utf-8"?>
        <propfind xmlns="DAV:">
          <prop>
            <resourcetype/>
            <displayname/>
          </prop>
        </propfind>`
    });

    if (!propfindResponse.ok) {
      console.error('Failed to access calendar:', propfindResponse.status, propfindResponse.statusText);
      return [];
    }

    // Récupérer les événements
    const reportResponse = await fetch(calendarUrl, {
      method: 'REPORT',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        'Depth': '1',
        'Content-Type': 'application/xml',
      },
      body: `<?xml version="1.0" encoding="utf-8"?>
        <calendar-query xmlns="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
          <prop>
            <getetag/>
            <c:calendar-data/>
          </prop>
          <filter>
            <c:comp-filter name="VCALENDAR">
              <c:comp-filter name="VEVENT">
                <c:time-range start="${formatDate(startDate)}" end="${formatDate(endDate)}"/>
              </c:comp-filter>
            </c:comp-filter>
          </filter>
        </calendar-query>`
    });

    if (!reportResponse.ok) {
      console.error('Failed to fetch events:', reportResponse.status, reportResponse.statusText);
      return [];
    }

    const xmlText = await reportResponse.text();
    console.log('Calendar response:', xmlText);

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const events = xmlDoc.getElementsByTagName('VEVENT');

    const busySlots: CalendarEvent[] = [];
    for (const event of events) {
      const start = event.getElementsByTagName('DTSTART')[0]?.textContent;
      const end = event.getElementsByTagName('DTEND')[0]?.textContent;
      if (start && end) {
        busySlots.push({
          start: new Date(start.replace('Z', '')),
          end: new Date(end.replace('Z', ''))
        });
      }
    }

    console.log('Found busy slots:', busySlots);
    return busySlots;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
} 