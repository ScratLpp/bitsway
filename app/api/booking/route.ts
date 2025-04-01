import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { fetchCalendarEvents } from '../available-slots/route';

const resend = new Resend(process.env.RESEND_API_KEY);

interface CalendarEvent {
  start: Date;
  end: Date;
}

export async function POST(req: Request) {
  try {
    const { date, time, name, email, message } = await req.json();

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Récupérer les événements du jour
    const events = await fetchCalendarEvents(new Date(date));
    
    // Vérifier si le créneau est disponible
    const isAvailable = !events.some((event: CalendarEvent) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const bookingTime = new Date(date);
      
      return (
        bookingTime >= eventStart &&
        bookingTime < eventEnd
      );
    });

    if (!isAvailable) {
      return NextResponse.json(
        { error: 'This time slot is no longer available' },
        { status: 400 }
      );
    }

    // Créer l'événement dans le calendrier
    const event = {
      summary: `Rendez-vous avec ${name}`,
      description: `Email: ${email}`,
      start: {
        dateTime: new Date(date).toISOString(),
        timeZone: 'Europe/Paris',
      },
      end: {
        dateTime: new Date(new Date(date).setHours(new Date(date).getHours() + 1)).toISOString(),
        timeZone: 'Europe/Paris',
      },
    };

    // Envoyer l'email de confirmation
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        date,
        time,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error('Failed to send confirmation email');
    }

    // Envoyer un email de notification à Bitsway
    await resend.emails.send({
      from: 'Bitsway <contact@bitsway.fr>',
      to: 'contact@bitsway.fr',
      subject: 'Nouvelle demande de rendez-vous',
      html: `
        <h2>Nouvelle demande de rendez-vous</h2>
        <p><strong>Client:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date souhaitée:</strong> ${new Date(date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Heure souhaitée:</strong> ${time}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
        <p><strong>Action requise:</strong> Vérifier la disponibilité dans le calendrier et confirmer le rendez-vous.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create booking' },
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