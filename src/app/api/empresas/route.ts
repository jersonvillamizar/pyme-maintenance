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

    const { searchParams } = new URL(request.url)
    const pageParam = searchParams.get("page")
    const limitParam = searchParams.get("limit")

    const include = {
      _count: {
        select: {
          usuarios: true,
          equipos: true,
        },
      },
    }

    // Si se solicita paginación
    if (pageParam) {
      const page = Math.max(1, parseInt(pageParam) || 1)
      const limit = Math.min(100, Math.max(1, parseInt(limitParam || "10") || 10))
      const skip = (page - 1) * limit

      const [empresas, total] = await Promise.all([
        prisma.empresa.findMany({ orderBy: { createdAt: "desc" }, include, skip, take: limit }),
        prisma.empresa.count(),
      ])

      return NextResponse.json({
        data: empresas,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      })
    }

    const empresas = await prisma.empresa.findMany({
      orderBy: { createdAt: "desc" },
      include,
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
