import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Construir filtros basados en el rol del usuario
    const userRole = session.user.role
    const userId = session.user.id
    const empresaId = session.user.empresaId

    let equiposWhere: Record<string, unknown> = {}
    let mantenimientosWhere: Record<string, unknown> = {}

    if (userRole === "CLIENTE" && empresaId) {
      equiposWhere = { empresaId }
      mantenimientosWhere = { equipo: { empresaId } }
    } else if (userRole === "TECNICO") {
      mantenimientosWhere = { tecnicoId: userId }
    }

    // Total de equipos
    const totalEquipos = await prisma.equipo.count({ where: equiposWhere })

    // Equipos por estado
    const equiposPorEstado = await prisma.equipo.groupBy({
      by: ["estado"],
      _count: true,
      where: equiposWhere,
    })

    // Total de mantenimientos
    const totalMantenimientos = await prisma.mantenimiento.count({
      where: mantenimientosWhere,
    })

    // Mantenimientos por estado
    const mantenimientosPorEstado = await prisma.mantenimiento.groupBy({
      by: ["estado"],
      _count: true,
      where: mantenimientosWhere,
    })

    // Mantenimientos por tipo
    const mantenimientosPorTipo = await prisma.mantenimiento.groupBy({
      by: ["tipo"],
      _count: true,
      where: mantenimientosWhere,
    })

    // Mantenimientos completados este mes
    const inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes.setHours(0, 0, 0, 0)

    const completadosEsteMes = await prisma.mantenimiento.count({
      where: {
        ...mantenimientosWhere,
        estado: "COMPLETADO",
        fechaRealizada: {
          gte: inicioMes,
        },
      },
    })

    // Mantenimientos completados el mes anterior (para calcular cambio)
    const inicioMesAnterior = new Date(inicioMes)
    inicioMesAnterior.setMonth(inicioMesAnterior.getMonth() - 1)

    const completadosMesAnterior = await prisma.mantenimiento.count({
      where: {
        ...mantenimientosWhere,
        estado: "COMPLETADO",
        fechaRealizada: {
          gte: inicioMesAnterior,
          lt: inicioMes,
        },
      },
    })

    // Equipos críticos (en mantenimiento o dados de baja)
    const equiposCriticos = await prisma.equipo.count({
      where: {
        ...equiposWhere,
        estado: {
          in: ["EN_MANTENIMIENTO", "DADO_DE_BAJA"],
        },
      },
    })

    // Mantenimientos pendientes (programados + en proceso)
    const mantenimientosPendientes = await prisma.mantenimiento.count({
      where: {
        ...mantenimientosWhere,
        estado: {
          in: ["PROGRAMADO", "EN_PROCESO"],
        },
      },
    })

    // Mantenimientos pendientes el mes anterior (para calcular cambio)
    const mantenimientosPendientesMesAnterior = await prisma.mantenimiento.count({
      where: {
        ...mantenimientosWhere,
        estado: {
          in: ["PROGRAMADO", "EN_PROCESO"],
        },
        createdAt: {
          lt: inicioMes,
        },
      },
    })

    // Próximos mantenimientos (los próximos 10 programados)
    const proximosMantenimientos = await prisma.mantenimiento.findMany({
      where: {
        ...mantenimientosWhere,
        estado: {
          in: ["PROGRAMADO", "EN_PROCESO"],
        },
      },
      orderBy: {
        fechaProgramada: "asc",
      },
      take: 10,
      include: {
        equipo: {
          select: {
            tipo: true,
            marca: true,
            modelo: true,
            serial: true,
            empresa: {
              select: {
                nombre: true,
              },
            },
          },
        },
        tecnico: {
          select: {
            nombre: true,
          },
        },
      },
    })

    // Mantenimientos por mes (últimos 6 meses)
    const seisMesesAtras = new Date()
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6)

    let mantenimientosParaGrafico: Array<{ mes: string; tipo: string; count: bigint }> = []

    if (userRole === "CLIENTE" && empresaId) {
      mantenimientosParaGrafico = await prisma.$queryRaw`
        SELECT
          TO_CHAR(DATE_TRUNC('month', "fechaProgramada"), 'YYYY-MM') as mes,
          tipo,
          COUNT(*)::bigint as count
        FROM mantenimientos
        WHERE "fechaProgramada" >= ${seisMesesAtras}
        AND "equipoId" IN (SELECT id FROM equipos WHERE "empresaId" = ${empresaId})
        GROUP BY DATE_TRUNC('month', "fechaProgramada"), tipo
        ORDER BY mes ASC
      `
    } else if (userRole === "TECNICO") {
      mantenimientosParaGrafico = await prisma.$queryRaw`
        SELECT
          TO_CHAR(DATE_TRUNC('month', "fechaProgramada"), 'YYYY-MM') as mes,
          tipo,
          COUNT(*)::bigint as count
        FROM mantenimientos
        WHERE "fechaProgramada" >= ${seisMesesAtras}
        AND "tecnicoId" = ${userId}
        GROUP BY DATE_TRUNC('month', "fechaProgramada"), tipo
        ORDER BY mes ASC
      `
    } else {
      mantenimientosParaGrafico = await prisma.$queryRaw`
        SELECT
          TO_CHAR(DATE_TRUNC('month', "fechaProgramada"), 'YYYY-MM') as mes,
          tipo,
          COUNT(*)::bigint as count
        FROM mantenimientos
        WHERE "fechaProgramada" >= ${seisMesesAtras}
        GROUP BY DATE_TRUNC('month', "fechaProgramada"), tipo
        ORDER BY mes ASC
      `
    }

    // Calcular cambios porcentuales
    const cambioCompletados = completadosMesAnterior > 0
      ? Math.round(((completadosEsteMes - completadosMesAnterior) / completadosMesAnterior) * 100)
      : completadosEsteMes > 0 ? 100 : 0

    const cambioPendientes = mantenimientosPendientesMesAnterior > 0
      ? Math.round(((mantenimientosPendientes - mantenimientosPendientesMesAnterior) / mantenimientosPendientesMesAnterior) * 100)
      : mantenimientosPendientes > 0 ? 100 : 0

    return NextResponse.json({
      totalEquipos,
      equiposPorEstado: equiposPorEstado.reduce((acc: Record<string, number>, item: { estado: string; _count: number }) => {
        acc[item.estado] = item._count
        return acc
      }, {} as Record<string, number>),
      totalMantenimientos,
      mantenimientosPorEstado: mantenimientosPorEstado.reduce((acc: Record<string, number>, item: { estado: string; _count: number }) => {
        acc[item.estado] = item._count
        return acc
      }, {} as Record<string, number>),
      mantenimientosPorTipo: mantenimientosPorTipo.reduce((acc: Record<string, number>, item: { tipo: string; _count: number }) => {
        acc[item.tipo] = item._count
        return acc
      }, {} as Record<string, number>),
      completadosEsteMes,
      cambioCompletados,
      equiposCriticos,
      mantenimientosPendientes,
      cambioPendientes,
      proximosMantenimientos,
      mantenimientosPorMes: mantenimientosParaGrafico.map(item => ({
        mes: item.mes,
        tipo: item.tipo,
        count: Number(item.count),
      })),
    })
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    )
  }
}
