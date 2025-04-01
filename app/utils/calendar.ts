// Fonction utilitaire pour formater les dates pour CalDAV
export function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

export async function fetchCalendarEvents(date: Date) {
  try {
    const calendarUrl = 'https://zimbra1.mail.ovh.net/dav/contact@bitsway.fr/Calendar/';
    const username = process.env.CALDAV_USERNAME;
    const password = process.env.CALDAV_PASSWORD;

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

    // Créer les dates de début et de fin de journée en UTC
    const startDate = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate() - 1,  // Soustraction d'un jour
      0, 0, 0
    ));
    const endDate = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate() - 1,  // Soustraction d'un jour
      23, 59, 59
    ));

    console.log('Date range:', {
      start: formatDate(startDate),
      end: formatDate(endDate)
    });

    // D'abord, faire une requête PROPFIND pour obtenir les informations du calendrier
    const propfindXml = `<?xml version="1.0" encoding="utf-8" ?>
      <D:propfind xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
        <D:prop>
          <D:displayname/>
          <C:calendar-description/>
        </D:prop>
      </D:propfind>`;

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
              <C:time-range start="${formatDate(startDate)}" end="${formatDate(endDate)}"/>
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
      
      // Convertir le format de date (YYYYMMDDTHHmmssZ ou YYYYMMDDTHHmmss)
      const startDate = startMatch[1].replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6');
      const endDate = endMatch[1].replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6');
      
      // Créer les dates en UTC
      const start = new Date(startDate + 'Z');
      const end = new Date(endDate + 'Z');
      
      console.log('Parsed dates:', { 
        start: start.toISOString(), 
        end: end.toISOString() 
      });
      
      events.push({ start, end });
    }
  }

  console.log('Parsed events:', events);
  return events;
}

export function generateAvailableSlots(date: Date, busySlots: { start: Date; end: Date }[]) {
  console.log('=== Début de generateAvailableSlots ===');
  console.log('Date reçue:', date.toISOString());
  console.log('Busy slots reçus:', busySlots.map(slot => ({
    start: slot.start.toISOString(),
    end: slot.end.toISOString()
  })));
  
  const slots = [];
  const workStart = 9; // 9h
  const workEnd = 18; // 18h

  // Créer la date de début de journée en UTC
  const startOfDay = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    0, 0, 0
  ));
  console.log('Début de journée (UTC):', startOfDay.toISOString());

  for (let hour = workStart; hour < workEnd; hour++) {
    const slotStart = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      hour, 0, 0
    ));
    const slotEnd = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      hour + 1, 0, 0
    ));

    console.log(`\nVérification du créneau ${hour}:00`);
    console.log('Créneau:', {
      start: slotStart.toISOString(),
      end: slotEnd.toISOString()
    });

    // Vérifier si le créneau est disponible
    const isAvailable = !busySlots.some(busy => {
      const busyStart = new Date(busy.start);
      const busyEnd = new Date(busy.end);
      
      console.log('Comparaison avec le créneau occupé:', {
        busyStart: busyStart.toISOString(),
        busyEnd: busyEnd.toISOString()
      });

      // Convertir toutes les dates en timestamps pour une comparaison plus précise
      const slotStartTime = slotStart.getTime();
      const slotEndTime = slotEnd.getTime();
      const busyStartTime = busyStart.getTime();
      const busyEndTime = busyEnd.getTime();
      
      const overlaps = (
        (slotStartTime >= busyStartTime && slotStartTime < busyEndTime) ||
        (slotEndTime > busyStartTime && slotEndTime <= busyEndTime) ||
        (slotStartTime <= busyStartTime && slotEndTime >= busyEndTime)
      );
      
      console.log('Résultat de la comparaison:', {
        slotStartTime,
        slotEndTime,
        busyStartTime,
        busyEndTime,
        overlaps
      });
      
      return overlaps;
    });

    console.log(`Créneau ${hour}:00 est ${isAvailable ? 'disponible' : 'indisponible'}`);

    if (isAvailable) {
      slots.push({
        time: slotStart.toISOString(),
        label: `${hour.toString().padStart(2, '0')}:00`,
      });
    }
  }

  console.log('\nCréneaux disponibles générés:', slots);
  console.log('=== Fin de generateAvailableSlots ===');
  return slots;
} 