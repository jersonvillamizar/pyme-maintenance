import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendPasswordResetEmail(
  to: string,
  token: string,
  nombre: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  const result = await transporter.sendMail({
    from: `MantenPro <${process.env.SMTP_USER}>`,
    to,
    subject: "Restablecer contraseña - MantenPro",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a;">Hola ${nombre},</h2>
        <p style="color: #4a4a4a; font-size: 16px;">
          Recibimos una solicitud para restablecer tu contraseña en MantenPro.
        </p>
        <p style="color: #4a4a4a; font-size: 16px;">
          Haz clic en el siguiente botón para crear una nueva contraseña:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}"
             style="background-color: #171717; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 500;">
            Restablecer Contraseña
          </a>
        </div>
        <p style="color: #6a6a6a; font-size: 14px;">
          Este enlace expirará en 1 hora. Si no solicitaste este cambio, puedes ignorar este correo.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;" />
        <p style="color: #9a9a9a; font-size: 12px;">
          MantenPro - Sistema de Gestión de Mantenimiento
        </p>
      </div>
    `,
  })

  return result
}

export async function sendContactMessage(
  nombre: string,
  email: string,
  mensaje: string
) {
  const adminEmail = process.env.ADMIN_EMAIL

  if (!adminEmail) {
    throw new Error("ADMIN_EMAIL no está configurado")
  }

  await transporter.sendMail({
    from: `MantenPro <${process.env.SMTP_USER}>`,
    to: adminEmail,
    replyTo: email,
    subject: `Nuevo mensaje de contacto - ${nombre}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a;">Nuevo mensaje de contacto</h2>
        <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 8px 0; color: #4a4a4a;">
            <strong>Nombre:</strong> ${nombre}
          </p>
          <p style="margin: 8px 0; color: #4a4a4a;">
            <strong>Email:</strong> ${email}
          </p>
        </div>
        <div style="margin: 20px 0;">
          <p style="color: #1a1a1a; font-weight: 600;">Mensaje:</p>
          <p style="color: #4a4a4a; font-size: 16px; white-space: pre-wrap;">${mensaje}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;" />
        <p style="color: #9a9a9a; font-size: 12px;">
          Puedes responder directamente a este correo para contactar a ${nombre}.
        </p>
      </div>
    `,
  })
}
