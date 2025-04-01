import { 
  parseISO, 
  startOfDay, 
  endOfDay, 
  setHours, 
  setMinutes, 
  setSeconds, 
  isWithinInterval,
  format,
  parse
} from 'date-fns';

// Fonction helper pour créer une date UTC
export function createUTCDate(
  year: number,
  month: number,
  day: number,
  hours: number = 0,
  minutes: number = 0,
  seconds: number = 0
): Date {
  return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
}

// Fonction helper pour convertir une date locale en UTC
export function localToUTC(date: Date): Date {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000);
}

// Fonction helper pour vérifier si une date est dans un intervalle
export function isDateInInterval(
  date: Date,
  start: Date,
  end: Date
): boolean {
  return isWithinInterval(date, { start, end });
}

// Fonction helper pour formater une date pour CalDAV
export function formatDateForCalDAV(date: Date): string {
  return format(date, "yyyyMMdd'T'HHmmss'Z'", { timeZone: 'UTC' });
}

// Fonction helper pour parser une date CalDAV
export function parseCalDAVDate(dateString: string): Date {
  // Si la date se termine par Z, elle est en UTC
  const isUTC = dateString.endsWith('Z');
  
  // Convertir le format YYYYMMDDTHHmmss en YYYY-MM-DDTHH:mm:ss
  const formattedDate = dateString
    .replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6')
    .replace('Z', '');

  const date = parseISO(formattedDate);
  
  // Si la date n'était pas en UTC, la convertir
  return isUTC ? date : localToUTC(date);
}

// Fonction helper pour créer un créneau horaire
export function createTimeSlot(
  date: Date,
  hour: number,
  duration: number = 1
): { start: Date; end: Date } {
  const start = setHours(setMinutes(setSeconds(date, 0), 0), hour);
  const end = setHours(setMinutes(setSeconds(date, 0), 0), hour + duration);
  
  return {
    start: createUTCDate(
      start.getUTCFullYear(),
      start.getUTCMonth(),
      start.getUTCDate(),
      start.getUTCHours(),
      start.getUTCMinutes(),
      start.getUTCSeconds()
    ),
    end: createUTCDate(
      end.getUTCFullYear(),
      end.getUTCMonth(),
      end.getUTCDate(),
      end.getUTCHours(),
      end.getUTCMinutes(),
      end.getUTCSeconds()
    )
  };
}

// Fonction helper pour vérifier si un créneau chevauche un événement
export function isSlotOverlapping(
  slot: { start: Date; end: Date },
  event: { start: Date; end: Date }
): boolean {
  return (
    (slot.start >= event.start && slot.start < event.end) ||
    (slot.end > event.start && slot.end <= event.end) ||
    (slot.start <= event.start && slot.end >= event.end)
  );
}

// Fonction helper pour obtenir le début et la fin d'une journée en UTC
export function getUTCDayRange(date: Date): { start: Date; end: Date } {
  const start = startOfDay(date);
  const end = endOfDay(date);
  
  return {
    start: createUTCDate(
      start.getUTCFullYear(),
      start.getUTCMonth(),
      start.getUTCDate()
    ),
    end: createUTCDate(
      end.getUTCFullYear(),
      end.getUTCMonth(),
      end.getUTCDate(),
      23, 59, 59
    )
  };
} 