"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, Clock, Wrench, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

interface Alerta {
  id: string
  tipo: "ATRASADO" | "PROXIMO" | "CRITICO"
  prioridad: "ALTA" | "MEDIA" | "BAJA"
  titulo: string
  mensaje: string
  fecha: Date
  mantenimiento?: any
  equipo?: any
}

interface AlertasData {
  alertas: Alerta[]
  contadores: {
    atrasados: number
    proximos: number
    criticos: number
    total: number
  }
}

const tipoConfig = {
  ATRASADO: {
    label: "Atrasado",
    color: "bg-red-500/10 text-red-700 border-red-200",
    icon: AlertTriangle,
  },
  PROXIMO: {
    label: "Próximo",
    color: "bg-blue-500/10 text-blue-700 border-blue-200",
    icon: Clock,
  },
  CRITICO: {
    label: "Crítico",
    color: "bg-orange-500/10 text-orange-700 border-orange-200",
    icon: Wrench,
  },
}

const prioridadConfig = {
  ALTA: { label: "Alta", color: "bg-red-500/10 text-red-700 border-red-200" },
  MEDIA: { label: "Media", color: "bg-yellow-500/10 text-yellow-700 border-yellow-200" },
  BAJA: { label: "Baja", color: "bg-green-500/10 text-green-700 border-green-200" },
}

export default function AlertasPage() {
  const [data, setData] = useState<AlertasData | null>(null)
  const [loading, setLoading] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState<string>("all")

  useEffect(() => {
    fetchAlertas()
  }, [])

  const fetchAlertas = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/alertas")
      if (!response.ok) throw new Error("Error al cargar alertas")

      const result = await response.json()
      setData(result)
    } catch (error) {
      toast.error("Error al cargar alertas")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const alertasFiltradas = data?.alertas.filter((alerta) => {
    if (filtroTipo === "all") return true
    return alerta.tipo === filtroTipo
  })

  return (
    <>
      <Header
        title="Alertas y Notificaciones"
        description="Monitoreo de mantenimientos y equipos críticos"
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Contadores */}
          {data && (
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total de Alertas</CardDescription>
                  <CardTitle className="text-3xl">{data.contadores.total}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Atrasados</CardDescription>
                  <CardTitle className="text-3xl text-red-600">{data.contadores.atrasados}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Próximos</CardDescription>
                  <CardTitle className="text-3xl text-blue-600">{data.contadores.proximos}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Equipos Críticos</CardDescription>
                  <CardTitle className="text-3xl text-orange-600">{data.contadores.criticos}</CardTitle>
                </CardHeader>
              </Card>
            </div>
          )}

          {/* Filtros */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Listado de Alertas</CardTitle>
                  <CardDescription>Alertas activas del sistema</CardDescription>
                </div>
                <Button onClick={fetchAlertas} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Actualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtro de tipo */}
              <div className="mb-4 flex gap-2">
                <Button
                  variant={filtroTipo === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroTipo("all")}
                >
                  Todas
                </Button>
                <Button
                  variant={filtroTipo === "ATRASADO" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroTipo("ATRASADO")}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Atrasados
                </Button>
                <Button
                  variant={filtroTipo === "PROXIMO" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroTipo("PROXIMO")}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Próximos
                </Button>
                <Button
                  variant={filtroTipo === "CRITICO" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroTipo("CRITICO")}
                >
                  <Wrench className="mr-2 h-4 w-4" />
                  Críticos
                </Button>
              </div>

              {/* Lista de alertas */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Cargando alertas...</p>
                </div>
              ) : alertasFiltradas && alertasFiltradas.length > 0 ? (
                <div className="space-y-3">
                  {alertasFiltradas.map((alerta) => {
                    const TipoIcon = tipoConfig[alerta.tipo].icon
                    return (
                      <Card key={alerta.id} className="border-l-4" style={{
                        borderLeftColor: alerta.prioridad === "ALTA" ? "#ef4444" : alerta.prioridad === "MEDIA" ? "#f59e0b" : "#22c55e"
                      }}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${alerta.prioridad === "ALTA" ? "bg-red-100" : alerta.prioridad === "MEDIA" ? "bg-yellow-100" : "bg-blue-100"}`}>
                              <TipoIcon className={`h-5 w-5 ${alerta.prioridad === "ALTA" ? "text-red-600" : alerta.prioridad === "MEDIA" ? "text-yellow-600" : "text-blue-600"}`} />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="font-semibold text-foreground">{alerta.titulo}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">{alerta.mensaje}</p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                  <Badge variant="outline" className={tipoConfig[alerta.tipo].color}>
                                    {tipoConfig[alerta.tipo].label}
                                  </Badge>
                                  <Badge variant="outline" className={prioridadConfig[alerta.prioridad].color}>
                                    {prioridadConfig[alerta.prioridad].label}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(alerta.fecha), "dd MMM yyyy, HH:mm", { locale: es })}
                                </p>
                                {alerta.mantenimiento && (
                                  <Link href={`/mantenimientos?id=${alerta.mantenimiento.id}`}>
                                    <Button variant="outline" size="sm">
                                      Ver Mantenimiento
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">
                    No hay alertas
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {filtroTipo === "all"
                      ? "Todo está bajo control"
                      : "No hay alertas de este tipo"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
