import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { date, time, name, email, message, isVideo } = await req.json();

    // Envoyer un email de confirmation au client
    await resend.emails.send({
      from: 'Bitsway <contact@bitsway.fr>',
      to: email,
      subject: 'Confirmation de votre rendez-vous',
      html: `
        <h2>Confirmation de votre rendez-vous</h2>
        <p>Bonjour ${name},</p>
        <p>Votre rendez-vous a été confirmé pour le ${new Date(date).toLocaleDateString('fr-FR')} à ${time}.</p>
        <p>Type de rendez-vous: ${isVideo ? 'Visio' : 'En présentiel'}</p>
        ${message ? `<p>Message: ${message}</p>` : ''}
        <p>Nous vous contacterons prochainement pour finaliser les détails.</p>
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
        <p><strong>Type:</strong> ${isVideo ? 'Visio' : 'En présentiel'}</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
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