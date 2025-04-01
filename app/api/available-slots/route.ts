import { NextResponse } from 'next/server';

async function fetchCalendarEvents(date: Date) {
  const username = process.env.CALDAV_USERNAME;
  const password = process.env.CALDAV_PASSWORD;
  const calendarUrl = 'https://zimbra1.mail.ovh.net/dav/contact@bitsway.fr/Calendar/';

  console.log('Environment variables check:', {
    hasUsername: !!username,
    hasPassword: !!password,
    username: username || 'not set',
    password: password ? '***' : 'not set'
  });

  if (!username || !password) {
    throw new Error('CalDAV credentials are not configured. Please check CALDAV_USERNAME and CALDAV_PASSWORD environment variables.');
  }

  console.log('Fetching calendar events for date:', date.toISOString());
  console.log('Using credentials:', { username, password: '***' });

  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  // D'abord, faire une requête PROPFIND pour obtenir les informations du calendrier
  const propfindXml = `<?xml version="1.0" encoding="utf-8" ?>
    <D:propfind xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
      <D:prop>
        <D:displayname/>
        <C:calendar-description/>
      </D:prop>
    </D:propfind>`;

  try {
    // Première requête pour vérifier l'accès
    console.log('Making PROPFIND request to:', calendarUrl);
    const propfindResponse = await fetch(calendarUrl, {
      method: 'PROPFIND',
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Depth': '1',
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0',
      },
      body: propfindXml,
    });

    console.log('PROPFIND response status:', propfindResponse.status);
    const propfindText = await propfindResponse.text();
    console.log('PROPFIND response:', propfindText);

    if (!propfindResponse.ok) {
      throw new Error(`PROPFIND failed: ${propfindResponse.status} - ${propfindText}`);
    }

    // Ensuite, faire la requête REPORT pour les événements
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

    console.log('Making REPORT request with XML:', reportXml);
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

    console.log('REPORT response status:', response.status);
    const responseText = await response.text();
    console.log('REPORT response:', responseText);

    if (!response.ok) {
      throw new Error(`REPORT failed: ${response.status} - ${responseText}`);
    }

    return parseCalendarData(responseText);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
}

function parseCalendarData(calendarData: string): { start: Date; end: Date }[] {
  console.log('Parsing calendar data:', calendarData);
  const events: { start: Date; end: Date }[] = [];
  
  // Recherche des événements dans le format CalDAV
  const eventMatches = calendarData.match(/<C:calendar-data[^>]*>[\s\S]*?<\/C:calendar-data>/g) || [];
  console.log('Found calendar-data matches:', eventMatches.length);

  for (const eventXml of eventMatches) {
    console.log('Processing event XML:', eventXml);
    // Recherche des dates dans le format VEVENT
    const startMatch = eventXml.match(/DTSTART[^:]*:(.*?)(?:\r?\n|$)/);
    const endMatch = eventXml.match(/DTEND[^:]*:(.*?)(?:\r?\n|$)/);

    if (startMatch && endMatch) {
      console.log('Found event dates:', { start: startMatch[1], end: endMatch[1] });
      events.push({
        start: new Date(startMatch[1].replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6')),
        end: new Date(endMatch[1].replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6')),
      });
    }
  }

  console.log('Parsed events:', events);
  return events;
}

function generateAvailableSlots(date: Date, busySlots: { start: Date; end: Date }[]) {
  console.log('Generating slots for date:', date.toISOString());
  console.log('Busy slots:', busySlots);
  
  const slots = [];
  const workStart = 9; // 9h
  const workEnd = 18; // 18h

  // Convertir la date en heure locale
  const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
  console.log('Local date:', localDate.toISOString());

  for (let hour = workStart; hour < workEnd; hour++) {
    const slotStart = new Date(localDate);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(localDate);
    slotEnd.setHours(hour + 1, 0, 0, 0);

    // Convertir les créneaux occupés en heure locale
    const isAvailable = !busySlots.some(busy => {
      const busyStart = new Date(busy.start);
      const busyEnd = new Date(busy.end);
      
      // Convertir en heure locale
      const localBusyStart = new Date(busyStart.getTime() - (busyStart.getTimezoneOffset() * 60000));
      const localBusyEnd = new Date(busyEnd.getTime() - (busyEnd.getTimezoneOffset() * 60000));
      
      const overlaps = (
        (slotStart >= localBusyStart && slotStart < localBusyEnd) ||
        (slotEnd > localBusyStart && slotEnd <= localBusyEnd) ||
        (slotStart <= localBusyStart && slotEnd >= localBusyEnd)
      );
      
      console.log(`Checking slot ${hour}:00 against busy slot ${localBusyStart.toISOString()} - ${localBusyEnd.toISOString()}: ${overlaps}`);
      return overlaps;
    });

    if (isAvailable) {
      // Convertir l'heure en UTC pour le stockage
      const utcSlotStart = new Date(slotStart.getTime() + (slotStart.getTimezoneOffset() * 60000));
      slots.push({
        time: utcSlotStart.toISOString(),
        label: `${hour.toString().padStart(2, '0')}:00`,
      });
    }
  }

  console.log('Generated available slots:', slots);
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

    console.log('Received request for date:', dateParam);
    const date = new Date(dateParam);
    
    // Ajuster la date pour le fuseau horaire local
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    console.log('Local date for fetching events:', localDate.toISOString());
    
    const busySlots = await fetchCalendarEvents(localDate);
    console.log('Fetched busy slots:', busySlots);
    
    const availableSlots = generateAvailableSlots(localDate, busySlots);
    console.log('Generated available slots:', availableSlots);

    return NextResponse.json({ slots: availableSlots });
  } catch (error) {
    console.error('Error getting available slots:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get available slots' },
      { status: 500 }
    );
  }
} 