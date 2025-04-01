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
      subject: 'Confirmation de votre rendez-vous',
      html: `
        <h2>Confirmation de votre rendez-vous</h2>
        <p>Bonjour ${name},</p>
        <p>Votre rendez-vous a été confirmé pour le ${new Date(date).toLocaleDateString('fr-FR')} à ${time}.</p>
        <p>Le rendez-vous se déroulera en visioconférence via Google Meet.</p>
        <p>Nous vous enverrons le lien de la réunion quelques minutes avant le rendez-vous.</p>
        ${message ? `<p>Message: ${message}</p>` : ''}
        <p>Nous vous attendons !</p>
        <p>Cordialement,<br>L'équipe Bitsway</p>
      `,
    });

    // Envoyer un email de notification à Bitsway
    await resend.emails.send({
      from: 'Bitsway <contact@bitsway.fr>',
      to: 'contact@bitsway.fr',
      subject: 'Nouveau rendez-vous',
      html: `
        <h2>Nouveau rendez-vous</h2>
        <p><strong>Client:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Heure:</strong> ${time}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
        <p><strong>Action requise:</strong> Créer une réunion Google Meet et envoyer le lien au client.</p>
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