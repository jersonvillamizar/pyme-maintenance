"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Plus, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmpresasTable } from "@/components/empresas/empresas-table"
import { EmpresaForm } from "@/components/empresas/empresa-form"
import { toast } from "sonner"
import type { EmpresaInput } from "@/lib/validations/empresa"

interface Empresa {
  id: string
  nombre: string
  nit: string
  contacto: string | null
  telefono: string | null
  email: string | null
  direccion: string | null
  _count?: {
    usuarios: number
    equipos: number
  }
}

export default function EmpresasPage() {
  const { data: session } = useSession()
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchEmpresas()
  }, [])

  const fetchEmpresas = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/empresas")

      if (!response.ok) {
        throw new Error("Error al cargar empresas")
      }

      const data = await response.json()
      setEmpresas(data)
    } catch (error) {
      toast.error("Error al cargar empresas")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: EmpresaInput) => {
    try {
      setIsSubmitting(true)
      const response = await fetch("/api/empresas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al crear empresa")
      }

      toast.success("Empresa creada exitosamente")
      setFormOpen(false)
      fetchEmpresas()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear empresa")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (empresa: Empresa) => {
    setEditingEmpresa(empresa)
    setFormOpen(true)
  }

  const handleUpdate = async (data: EmpresaInput) => {
    if (!editingEmpresa) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/empresas/${editingEmpresa.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al actualizar empresa")
      }

      toast.success("Empresa actualizada exitosamente")
      setFormOpen(false)
      setEditingEmpresa(undefined)
      fetchEmpresas()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar empresa")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/empresas/${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al eliminar empresa")
      }

      toast.success("Empresa eliminada exitosamente")
      fetchEmpresas()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar empresa")
    }
  }

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open)
    if (!open) {
      setEditingEmpresa(undefined)
    }
  }

  const isAdmin = session?.user?.role === "ADMIN"

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Empresas</h2>
            <p className="text-sm text-muted-foreground">
              Gestión de empresas cliente del sistema
            </p>
          </div>
          {isAdmin && (
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Empresa
            </Button>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Listado de Empresas</CardTitle>
                    <CardDescription>
                      {empresas.length} {empresas.length === 1 ? "empresa registrada" : "empresas registradas"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">Cargando empresas...</p>
                  </div>
                ) : (
                  <EmpresasTable
                    empresas={empresas}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <EmpresaForm
        empresa={editingEmpresa}
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        onSubmit={editingEmpresa ? handleUpdate : handleCreate}
        isLoading={isSubmitting}
      />
    </div>
  )
}
