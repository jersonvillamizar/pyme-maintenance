import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, nombre: true, email: true, activo: true },
    })

    console.log("forgot-password: buscando usuario con email:", email)

    // Siempre responder éxito para no revelar si el email existe
    if (!user || !user.activo) {
      console.log("forgot-password: usuario no encontrado o inactivo")
      return NextResponse.json({
        message: "Si el correo existe, recibirás instrucciones para restablecer tu contraseña.",
      })
    }

    console.log("forgot-password: usuario encontrado:", user.nombre)

    const resetToken = crypto.randomUUID()
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    })

    console.log("forgot-password: token guardado, enviando email...")
    const emailResult = await sendPasswordResetEmail(user.email, resetToken, user.nombre)
    console.log("forgot-password: resultado email:", JSON.stringify(emailResult))

    return NextResponse.json({
      message: "Si el correo existe, recibirás instrucciones para restablecer tu contraseña.",
    })
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      )
    }

    console.error("Error en forgot-password:", error)
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}
