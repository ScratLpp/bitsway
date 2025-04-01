import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, email, date, time } = await request.json()

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a; margin-bottom: 20px;">Rendez-vous confirmé</h2>
        <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
          Bonjour ${name},
        </p>
        <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
          Votre rendez-vous est confirmé pour le ${new Date(date).toLocaleDateString('fr-FR', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })} à ${new Date(date).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })}.
        </p>
        <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
          Nous vous attendons à l'adresse suivante :<br>
          <strong>Bitsway</strong><br>
          123 rue de la République<br>
          75001 Paris
        </p>
        <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
          Si vous souhaitez modifier ou annuler votre rendez-vous, veuillez nous contacter par email à contact@bitsway.fr.
        </p>
        <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
          Nous vous souhaitons une excellente journée !
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Cet email a été envoyé automatiquement, merci de ne pas y répondre.
        </p>
      </div>
    `

    const data = await resend.emails.send({
      from: 'Bitsway <contact@bitsway.fr>',
      to: email,
      subject: 'Confirmation de votre rendez-vous',
      html: emailContent,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    )
  }
} 