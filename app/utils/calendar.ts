import { 
  formatDateForCalDAV, 
  parseCalDAVDate, 
  createTimeSlot, 
  isSlotOverlapping,
  getUTCDayRange,
  createUTCDate
} from './dateHelpers';

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
    
    // Important: Pour être sûr, afficher également la date en format local
    console.log('Date locale équivalente:', new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ).toString());

    // Obtenir la plage de dates en UTC
    const { start: startDate, end: endDate } = getUTCDayRange(date);
    console.log('Date range élargie:', {
      start: formatDateForCalDAV(startDate),
      end: formatDateForCalDAV(endDate)
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
              <C:time-range start="${formatDateForCalDAV(startDate)}" end="${formatDateForCalDAV(endDate)}"/>
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

    // Récupérer tous les événements, puis les filtrer par date exacte après
    const allEvents = parseCalendarData(responseText);
    
    // Filtrer les événements pour ne garder que ceux du jour demandé
    const targetDateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    console.log('Date cible à filtrer:', targetDateStr);
    
    const filteredEvents = allEvents.filter(event => {
      const eventDateStr = event.start.toISOString().split('T')[0];
      const isMatch = eventDateStr === targetDateStr;
      console.log(`Événement le ${eventDateStr} - correspond à ${targetDateStr}? ${isMatch}`);
      return isMatch;
    });
    
    console.log(`Après filtrage: ${filteredEvents.length} événements sur ${allEvents.length} correspondent à la date ${targetDateStr}`);
    
    return filteredEvents;
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
    // Essayer de récupérer le résumé aussi pour plus de contexte
    const summaryMatch = eventXml.match(/SUMMARY:(.*?)(?:\r?\n|$)/);
    const summary = summaryMatch ? summaryMatch[1] : 'Pas de titre';

    if (startMatch && endMatch) {
      console.log('Found event dates:', { 
        summary,
        start: startMatch[1], 
        end: endMatch[1] 
      });
      
      // Rechercher la timezone si présente
      const tzidMatch = eventXml.match(/TZID=(.*?)[:;]/);
      const tzid = tzidMatch ? tzidMatch[1] : null;
      console.log('Timezone info:', tzid || 'not specified');
      
      // Utiliser la fonction helper pour parser les dates
      const start = parseCalDAVDate(startMatch[1]);
      const end = parseCalDAVDate(endMatch[1]);
      
      console.log('Parsed dates:', { 
        start: start.toISOString(), 
        end: end.toISOString(),
        localEquivalentStart: new Date(start.getTime()).toString(),
        localEquivalentEnd: new Date(end.getTime()).toString()
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
    end: slot.end.toISOString(),
    startLocal: new Date(slot.start).toString(),
    endLocal: new Date(slot.end).toString()
  })));
  
  const slots = [];
  const workStart = 9; // 9h
  const workEnd = 18; // 18h

  for (let hour = workStart; hour < workEnd; hour++) {
    const slot = createTimeSlot(date, hour);
    
    console.log(`\nVérification du créneau ${hour}:00`);
    console.log('Créneau:', {
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      startLocal: new Date(slot.start).toString(),
      endLocal: new Date(slot.end).toString()
    });

    // Vérifier si le créneau est disponible
    let isAvailable = true;
    
    for (const busy of busySlots) {
      console.log('Comparaison avec le créneau occupé:', {
        busyStart: busy.start.toISOString(),
        busyEnd: busy.end.toISOString(),
        busyStartLocal: new Date(busy.start).toString(),
        busyEndLocal: new Date(busy.end).toString()
      });
      
      if (isSlotOverlapping(slot, busy)) {
        isAvailable = false;
        console.log(`Créneau ${hour}:00 marqué comme indisponible à cause de cet événement`);
        break;
      }
    }

    console.log(`Créneau ${hour}:00 est ${isAvailable ? 'disponible' : 'indisponible'}`);

    if (isAvailable) {
      slots.push({
        time: slot.start.toISOString(),
        label: `${hour.toString().padStart(2, '0')}:00`,
      });
    }
  }

  console.log('\nCréneaux disponibles générés:', slots);
  console.log('=== Fin de generateAvailableSlots ===');
  return slots;
} 