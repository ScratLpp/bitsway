import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { fetchCalendarEvents, generateAvailableSlots } from '@/app/utils/calendar';

const resend = new Resend(process.env.RESEND_API_KEY);

interface CalendarEvent {
  start: Date;
  end: Date;
}

export async function POST(request: Request) {
  try {
    const { name, email, date, time } = await request.json();

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Vérifier si le créneau est disponible
    const events = await fetchCalendarEvents(new Date(date));
    const requestedSlot = new Date(time);
    const requestedSlotEnd = new Date(requestedSlot);
    requestedSlotEnd.setHours(requestedSlotEnd.getHours() + 1);

    const isSlotAvailable = !events.some(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return (
        (requestedSlot >= eventStart && requestedSlot < eventEnd) ||
        (requestedSlotEnd > eventStart && requestedSlotEnd <= eventEnd) ||
        (requestedSlot <= eventStart && requestedSlotEnd >= eventEnd)
      );
    });

    if (!isSlotAvailable) {
      return NextResponse.json(
        { error: 'Selected time slot is not available' },
        { status: 400 }
      );
    }

    // Envoyer l'email de confirmation
    await resend.emails.send({
      from: 'contact@bitsway.fr',
      to: email,
      subject: 'Confirmation de votre rendez-vous',
      html: `
        <h1>Confirmation de votre rendez-vous</h1>
        <p>Bonjour ${name},</p>
        <p>Votre rendez-vous a été confirmé pour le ${new Date(date).toLocaleDateString('fr-FR')} à ${new Date(time).toLocaleTimeString('fr-FR')}.</p>
        <p>Nous vous attendons avec impatience !</p>
      `
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing booking:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process booking' },
      { status: 500 }
    );
  }
}

// Endpoint pour récupérer les créneaux disponibles
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
    console.error('Error fetching available slots:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get available slots' },
      { status: 500 }
    );
  }
} 