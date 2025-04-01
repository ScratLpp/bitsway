import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { fetchCalendarEvents } from '@/app/utils/calendar';

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
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date requise' }, { status: 400 });
    }

    // Récupérer les événements du jour
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date(date).toISOString(),
      timeMax: new Date(new Date(date).setHours(23, 59, 59)).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    // Générer les créneaux disponibles (9h-18h)
    const availableSlots = [];
    const busySlots = events.data.items?.map(event => ({
      start: new Date(event.start?.dateTime || event.start?.date || '').getHours(),
      end: new Date(event.end?.dateTime || event.end?.date || '').getHours(),
    })) || [];

    for (let hour = 9; hour < 18; hour++) {
      const isSlotAvailable = !busySlots.some(slot => 
        hour >= slot.start && hour < slot.end
      );

      if (isSlotAvailable) {
        availableSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      }
    }

    return NextResponse.json({ availableSlots });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des créneaux' },
      { status: 500 }
    );
  }
} 