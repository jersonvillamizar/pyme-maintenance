import { NextResponse } from "next/server"
import { z } from "zod"
import { sendContactMessage } from "@/lib/email"

const contactSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100),
  email: z.string().email("Email inválido"),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres").max(1000, "Máximo 1000 caracteres"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, email, mensaje } = contactSchema.parse(body)

    await sendContactMessage(nombre, email, mensaje)

    return NextResponse.json({
      message: "Mensaje enviado correctamente.",
    })
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Por favor completa todos los campos correctamente" },
        { status: 400 }
      )
    }

    console.error("Error en contacto:", error)
    return NextResponse.json(
      { error: "Error al enviar el mensaje. Inténtalo de nuevo." },
      { status: 500 }
    )
  }
}
