import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { date, time, name, email, message } = await req.json();

    // Envoyer un email de confirmation au client
    await resend.emails.send({
      from: 'Bitsway <contact@bitsway.fr>',
      to: email,
      subject: 'Demande de rendez-vous',
      html: `
        <h2>Demande de rendez-vous reçue</h2>
        <p>Bonjour ${name},</p>
        <p>Nous avons bien reçu votre demande de rendez-vous pour le ${new Date(date).toLocaleDateString('fr-FR')} à ${time}.</p>
        <p>Nous vous contacterons dans les plus brefs délais pour confirmer ce créneau ou vous proposer une alternative.</p>
        ${message ? `<p>Message: ${message}</p>` : ''}
        <p>Cordialement,<br>L'équipe Bitsway</p>
      `,
    });

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
    console.error('Error booking appointment:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la prise de rendez-vous' },
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