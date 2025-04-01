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

    // Créer les dates de début et de fin de journée en UTC
    // IMPORTANT: Assurons-nous de faire une recherche élargie pour capter tous les événements potentiels
    const startDate = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate() - 1, // Élargir la recherche au jour précédent
      0, 0, 0
    ));
    const endDate = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate() + 1, // Élargir la recherche au jour suivant
      23, 59, 59
    ));

    console.log('Date range élargie:', {
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
      
      // Convertir le format de date (YYYYMMDDTHHmmssZ ou YYYYMMDDTHHmmss)
      const startDateString = startMatch[1].replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6');
      const endDateString = endMatch[1].replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6');
      
      // Si la date n'a pas de Z et pas de TZID, supposer qu'elle est en heure locale
      const isUTC = startMatch[1].endsWith('Z');
      console.log('Event time format is UTC?', isUTC);
      
      let start, end;
      
      if (isUTC) {
        // Déjà en UTC
        start = new Date(startDateString);
        end = new Date(endDateString);
      } else {
        // Convertir explicitement en UTC (important: comprendre le fuseau horaire du serveur)
        // Supposons que les dates sans Z sont dans le fuseau horaire Europe/Paris (UTC+2 en été)
        const localStartDate = new Date(startDateString);
        const localEndDate = new Date(endDateString);
        
        // Obtenez l'offset en minutes pour convertir de local à UTC
        const offsetInMinutes = localStartDate.getTimezoneOffset();
        
        // Créer des dates UTC en ajustant par l'offset
        start = new Date(localStartDate.getTime() - offsetInMinutes * 60000);
        end = new Date(localEndDate.getTime() - offsetInMinutes * 60000);
      }
      
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
    // Ajouter l'affichage en heure locale pour le débogage
    startLocal: new Date(slot.start).toString(),
    endLocal: new Date(slot.end).toString()
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
      end: slotEnd.toISOString(),
      // Ajouter l'affichage en heure locale pour le débogage
      startLocal: new Date(slotStart).toString(),
      endLocal: new Date(slotEnd).toString()
    });

    // Vérifier si le créneau est disponible
    let isAvailable = true;
    
    for (const busy of busySlots) {
      // Convertir toutes les dates en timestamps pour une comparaison plus précise
      const slotStartTime = slotStart.getTime();
      const slotEndTime = slotEnd.getTime();
      const busyStartTime = busy.start.getTime();
      const busyEndTime = busy.end.getTime();
      
      console.log('Comparaison avec le créneau occupé:', {
        busyStart: busy.start.toISOString(),
        busyEnd: busy.end.toISOString(),
        busyStartLocal: new Date(busy.start).toString(),
        busyEndLocal: new Date(busy.end).toString()
      });
      
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
      
      if (overlaps) {
        isAvailable = false;
        console.log(`Créneau ${hour}:00 marqué comme indisponible à cause de cet événement`);
        break;
      }
    }

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