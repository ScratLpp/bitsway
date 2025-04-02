import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    console.log('API Key available:', !!process.env.RESEND_API_KEY);
    
    const { name, email, message } = await request.json();
    console.log('Received form data:', { name, email, message });

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Configuration Resend manquante' },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Bitsway <onboarding@resend.dev>',
      to: 'gaetanlepape@bitsway.fr',
      subject: `Nouveau message de ${name}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email', details: error },
        { status: 500 }
      );
    }

    console.log('Email sent successfully:', data);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 