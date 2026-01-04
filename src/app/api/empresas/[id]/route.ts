import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateEmpresaSchema } from "@/lib/validations/empresa"

// GET /api/empresas/[id] - Obtener una empresa por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const empresa = await prisma.empresa.findUnique({
      where: { id: params.id },
      include: {
        usuarios: {
          select: {
            id: true,
            nombre: true,
            email: true,
            role: true,
          },
        },
        equipos: {
          select: {
            id: true,
            tipo: true,
            marca: true,
            serial: true,
            estado: true,
          },
        },
      },
    })

    if (!empresa) {
      return NextResponse.json(
        { error: "Empresa no encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(empresa)
  } catch (error) {
    console.error("Error al obtener empresa:", error)
    return NextResponse.json(
      { error: "Error al obtener empresa" },
      { status: 500 }
    )
  }
}

// PUT /api/empresas/[id] - Actualizar empresa
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateEmpresaSchema.parse(body)

    // Verificar que la empresa existe
    const existingEmpresa = await prisma.empresa.findUnique({
      where: { id: params.id },
    })

    if (!existingEmpresa) {
      return NextResponse.json(
        { error: "Empresa no encontrada" },
        { status: 404 }
      )
    }

    // Si se actualiza el NIT, verificar que no exista
    if (validatedData.nit && validatedData.nit !== existingEmpresa.nit) {
      const nitExists = await prisma.empresa.findUnique({
        where: { nit: validatedData.nit },
      })

      if (nitExists) {
        return NextResponse.json(
          { error: "Ya existe una empresa con este NIT" },
          { status: 400 }
        )
      }
    }

    const empresa = await prisma.empresa.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json(empresa)
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      )
    }

    console.error("Error al actualizar empresa:", error)
    return NextResponse.json(
      { error: "Error al actualizar empresa" },
      { status: 500 }
    )
  }
}

// DELETE /api/empresas/[id] - Eliminar empresa
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    // Verificar que la empresa existe
    const empresa = await prisma.empresa.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            usuarios: true,
            equipos: true,
          },
        },
      },
    })

    if (!empresa) {
      return NextResponse.json(
        { error: "Empresa no encontrada" },
        { status: 404 }
      )
    }

    // Verificar si tiene datos relacionados
    if (empresa._count.usuarios > 0 || empresa._count.equipos > 0) {
      return NextResponse.json(
        {
          error: "No se puede eliminar la empresa porque tiene usuarios o equipos asociados",
          details: {
            usuarios: empresa._count.usuarios,
            equipos: empresa._count.equipos,
          }
        },
        { status: 400 }
      )
    }

    await prisma.empresa.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Empresa eliminada exitosamente" })
  } catch (error) {
    console.error("Error al eliminar empresa:", error)
    return NextResponse.json(
      { error: "Error al eliminar empresa" },
      { status: 500 }
    )
  }
}
