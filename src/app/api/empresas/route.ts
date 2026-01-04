import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { empresaSchema } from "@/lib/validations/empresa"

// GET /api/empresas - Listar todas las empresas
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const empresas = await prisma.empresa.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            usuarios: true,
            equipos: true,
          },
        },
      },
    })

    return NextResponse.json(empresas)
  } catch (error) {
    console.error("Error al obtener empresas:", error)
    return NextResponse.json(
      { error: "Error al obtener empresas" },
      { status: 500 }
    )
  }
}

// POST /api/empresas - Crear nueva empresa
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo admin puede crear empresas
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = empresaSchema.parse(body)

    // Verificar que el NIT no exista
    const existingEmpresa = await prisma.empresa.findUnique({
      where: { nit: validatedData.nit },
    })

    if (existingEmpresa) {
      return NextResponse.json(
        { error: "Ya existe una empresa con este NIT" },
        { status: 400 }
      )
    }

    const empresa = await prisma.empresa.create({
      data: validatedData,
    })

    return NextResponse.json(empresa, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      )
    }

    console.error("Error al crear empresa:", error)
    return NextResponse.json(
      { error: "Error al crear empresa" },
      { status: 500 }
    )
  }
}
