import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, name, role } = await request.json(); // Ahora recibimos también el ROLE

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    // --- DISEÑO PARA EL PACIENTE ---
    const htmlPaciente = `
      <div style="background-color: #F8FAFF; padding: 40px 20px; font-family: sans-serif;">
        <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; box-shadow: 0 10px 25px rgba(127, 168, 248, 0.1); border-top: 8px solid #8AD8CB;">
          <div style="text-align: center; margin-bottom: 24px;"><span style="font-size: 50px;">🦋</span></div>
          <h1 style="color: #1E293B; text-align: center; font-size: 26px; font-weight: 800;">¡Bienvenido a Nabi, ${name}!</h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.7; text-align: center;">
            Has dado un paso valiente hoy. En Nabi, creemos que el bienestar se construye un día a la vez, y estamos aquí para darte las herramientas que necesitas.
          </p>
          
          <div style="background-color: #F0FDFA; border-radius: 16px; padding: 24px; margin: 30px 0; border: 1px solid #CCFBF1;">
            <h2 style="color: #134E48; font-size: 18px; margin-top: 0;">Descubre todo lo que puedes lograr</h2>
            <p style="color: #115E59; font-size: 14px; margin-bottom: 12px; line-height: 1.5;">
              Al entrar a tu portal, notarás la silueta de una mariposa. Es el <b>Compañero Nabi</b>, un asistente terapéutico inteligente y exclusivo de nuestro plan <b>Premium</b>. Al suscribirte, podrás desbloquearlo para recibir consejos diarios basados en tu estado de ánimo, y ver cómo evoluciona con tus rachas.
            </p>
            <p style="color: #115E59; font-size: 14px; margin-bottom: 0; line-height: 1.5; padding-top: 12px; border-top: 1px solid #99F6E4;">
              Además, con Premium tendrás la posibilidad de combinar hasta <b>dos rutas clínicas</b> al mismo tiempo (por ejemplo, Ansiedad e Insomnio), recibiendo tareas personalizadas para una experiencia 100% adaptada a ti.
            </p>
          </div>

          <p style="color: #64748B; font-size: 14px; text-align: center;">
            Regresa a la app, elige tu ruta clínica y comienza tu transformación.
          </p>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 40px 0 24px 0;" />
          <p style="color: #94A3B8; font-size: 14px; text-align: center;">Con cariño, <b>El equipo de Nabi</b></p>
        </div>
      </div>
    `;

    // --- DISEÑO PARA EL PSICÓLOGO ---
    const htmlPsicologo = `
      <div style="background-color: #F8FAFF; padding: 40px 20px; font-family: sans-serif;">
        <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; padding: 40px; box-shadow: 0 10px 25px rgba(127, 168, 248, 0.1); border-top: 8px solid #7FA8F8;">
          <div style="text-align: center; margin-bottom: 24px;"><span style="font-size: 50px;">💼</span></div>
          <h1 style="color: #1E293B; text-align: center; font-size: 26px; font-weight: 800;">Hola, Dr./Dra. ${name}</h1>
          <p style="color: #475569; font-size: 16px; line-height: 1.7; text-align: center;">
            Gracias por elegir Nabi como tu herramienta de apoyo clínico. Estamos comprometidos en facilitar el seguimiento de tus pacientes y optimizar sus resultados.
          </p>
          
          <div style="background-color: #F8FAFC; border-radius: 16px; padding: 24px; margin: 30px 0; border: 1px solid #E2E8F0;">
            <h2 style="color: #1E293B; font-size: 18px; margin-top: 0;">Tu consultorio digital</h2>
            <p style="color: #475569; font-size: 14px;">
              En tu portal podrás vincular hasta <b>5 pacientes de forma gratuita</b> para monitorear sus tareas y estados de ánimo en tiempo real. 
            </p>
            <p style="color: #64748B; font-size: 13px; font-style: italic; margin-bottom: 0;">
              Si deseas gestionar un consultorio más grande sin límites de pacientes, recuerda que puedes actualizar a nuestra cuenta <b>Nabi Profesional</b> en cualquier momento.
            </p>
          </div>

          <p style="color: #64748B; font-size: 14px; text-align: center;">
            Ya puedes comenzar a vincular pacientes usando tu código único de profesional.
          </p>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 40px 0 24px 0;" />
          <p style="color: #94A3B8; font-size: 14px; text-align: center;">Saludos cordiales, <b>Equipo de Soporte Nabi</b></p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Nabi App 🦋" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: role === 'psicologo' ? 'Bienvenido a Nabi: Tu gestión clínica' : '¡Bienvenido a Nabi! 🦋',
      html: role === 'psicologo' ? htmlPsicologo : htmlPaciente,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Correo enviado" });
  } catch (error) {
    return NextResponse.json({ error: "Error enviando correo" }, { status: 500 });
  }
}