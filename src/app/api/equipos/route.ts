import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { equipoSchema } from "@/lib/validations/equipo"

// GET /api/equipos - Listar todos los equipos
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const empresaId = searchParams.get("empresaId")
    const estado = searchParams.get("estado")

    const where: any = {}

    // Filtrar por empresa si se proporciona
    if (empresaId) {
      where.empresaId = empresaId
    }

    // Filtrar por estado si se proporciona
    if (estado) {
      where.estado = estado
    }

    // Si es cliente, solo ver equipos de su empresa
    if (session.user.role === "CLIENTE" && session.user.empresaId) {
      where.empresaId = session.user.empresaId
    }

    const equipos = await prisma.equipo.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        empresa: {
          select: {
            id: true,
            nombre: true,
            nit: true,
          },
        },
        _count: {
          select: {
            mantenimientos: true,
          },
        },
      },
    })

    return NextResponse.json(equipos)
  } catch (error) {
    console.error("Error al obtener equipos:", error)
    return NextResponse.json(
      { error: "Error al obtener equipos" },
      { status: 500 }
    )
  }
}

// POST /api/equipos - Crear nuevo equipo
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo admin y cliente pueden crear equipos
    if (session.user.role === "TECNICO") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = equipoSchema.parse(body)

    // Si es cliente, forzar que sea de su empresa
    if (session.user.role === "CLIENTE" && session.user.empresaId) {
      validatedData.empresaId = session.user.empresaId
    }

    // Verificar que el serial no exista
    const existingEquipo = await prisma.equipo.findUnique({
      where: { serial: validatedData.serial },
    })

    if (existingEquipo) {
      return NextResponse.json(
        { error: "Ya existe un equipo con este serial" },
        { status: 400 }
      )
    }

    // Verificar que la empresa exista
    const empresa = await prisma.empresa.findUnique({
      where: { id: validatedData.empresaId },
    })

    if (!empresa) {
      return NextResponse.json(
        { error: "Empresa no encontrada" },
        { status: 404 }
      )
    }

    const equipo = await prisma.equipo.create({
      data: validatedData,
      include: {
        empresa: {
          select: {
            id: true,
            nombre: true,
            nit: true,
          },
        },
      },
    })

    return NextResponse.json(equipo, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      )
    }

    console.error("Error al crear equipo:", error)
    return NextResponse.json(
      { error: "Error al crear equipo" },
      { status: 500 }
    )
  }
}
