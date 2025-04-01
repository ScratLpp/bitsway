import { NextResponse } from 'next/server';
import { fetchCalendarEvents, generateAvailableSlots } from '@/app/utils/calendar';

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