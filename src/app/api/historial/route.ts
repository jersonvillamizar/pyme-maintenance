import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const equipoId = searchParams.get("equipoId")
    const tecnicoId = searchParams.get("tecnicoId")
    const empresaId = searchParams.get("empresaId")
    const fechaDesde = searchParams.get("fechaDesde")
    const fechaHasta = searchParams.get("fechaHasta")

    const userRole = session.user.role
    const userEmpresaId = session.user.empresaId
    const userId = session.user.id

    // Construir filtros base según rol
    let whereClause: any = {}

    // Filtros por rol
    if (userRole === "CLIENTE" && userEmpresaId) {
      whereClause.equipo = { empresaId: userEmpresaId }
    } else if (userRole === "TECNICO") {
      whereClause.tecnicoId = userId
    }

    // Filtros adicionales
    if (equipoId) {
      whereClause.equipoId = equipoId
    }

    if (tecnicoId && userRole === "ADMIN") {
      whereClause.tecnicoId = tecnicoId
    }

    if (empresaId && userRole === "ADMIN") {
      whereClause.equipo = { ...whereClause.equipo, empresaId }
    }

    // Filtros de fecha
    if (fechaDesde || fechaHasta) {
      whereClause.fecha = {}
      if (fechaDesde) {
        whereClause.fecha.gte = new Date(fechaDesde)
      }
      if (fechaHasta) {
        whereClause.fecha.lte = new Date(fechaHasta)
      }
    }

    const historial = await prisma.historial.findMany({
      where: whereClause,
      include: {
        equipo: {
          select: {
            id: true,
            tipo: true,
            marca: true,
            modelo: true,
            serial: true,
            empresa: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
        tecnico: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
        mantenimiento: {
          select: {
            id: true,
            tipo: true,
            estado: true,
            descripcion: true,
          },
        },
      },
      orderBy: {
        fecha: "desc",
      },
    })

    return NextResponse.json(historial)
  } catch (error) {
    console.error("Error al obtener historial:", error)
    return NextResponse.json(
      { error: "Error al obtener historial" },
      { status: 500 }
    )
  }
}
