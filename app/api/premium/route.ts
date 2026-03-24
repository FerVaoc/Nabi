import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, name, amount, cycle } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Nabi App 🦋" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: '¡Bienvenido a Nabi Premium! 🎉',
      html: `
        <div style="background-color: #F8FAFF; padding: 40px 20px; font-family: sans-serif;">
          <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; box-shadow: 0 10px 25px rgba(253, 224, 71, 0.2); border-top: 8px solid #FDE047;">
            <div style="text-align: center; margin-bottom: 24px;"><span style="font-size: 50px;">🌟</span></div>
            <h1 style="color: #1E293B; text-align: center; font-size: 24px; font-weight: 800;">¡Gracias por tu compra, ${name}!</h1>
            <p style="color: #475569; font-size: 16px; line-height: 1.7; text-align: center;">
              Tu suscripción al plan <b>Premium (${cycle})</b> se ha activado correctamente. Tu pago de <b>$${amount} MXN</b> ha sido procesado.
            </p>
            
            <div style="background-color: #FFFBEB; border-radius: 16px; padding: 24px; margin: 30px 0; border: 1px solid #FEF3C7;">
              <h2 style="color: #D97706; font-size: 18px; margin-top: 0;">¡Tu compañero te espera!</h2>
              <p style="color: #B45309; font-size: 14px; margin-bottom: 0;">
                Ve a tu Dashboard, tu nuevo compañero evolutivo ya está desbloqueado. Comienza a registrar tus tareas y estado de ánimo para verlo crecer.
              </p>
            </div>

            <p style="color: #94A3B8; font-size: 14px; text-align: center;">Con cariño, <b>El equipo de Nabi</b></p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Recibo enviado con éxito" });
  } catch (error) {
    console.error("Error enviando recibo:", error);
    return NextResponse.json({ error: "Error enviando correo" }, { status: 500 });
  }
}