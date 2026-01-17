"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MetricCard } from "@/components/metric-card"
import { MaintenanceChart } from "@/components/maintenance-chart"
import { MaintenanceTable } from "@/components/maintenance-table"
import { Wrench, ClipboardList, BarChart3, Bell, FileDown, FileSpreadsheet, Clock, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { exportEstadisticasToExcel } from "@/lib/excel-export"
import { exportEstadisticasToPDF } from "@/lib/pdf-export"

interface FallaRecurrente {
  equipoId: string
  cantidadFallas: number
  equipo: {
    tipo: string
    marca: string
    modelo: string | null
    serial: string
    empresa: string
  } | null
}

interface DashboardStats {
  totalEquipos: number
  equiposPorEstado: Record<string, number>
  totalMantenimientos: number
  mantenimientosPorEstado: Record<string, number>
  mantenimientosPorTipo: Record<string, number>
  completadosEsteMes: number
  cambioCompletados: number
  equiposCriticos: number
  mantenimientosPendientes: number
  cambioPendientes: number
  proximosMantenimientos: any[]
  mantenimientosPorMes: Array<{
    mes: string
    tipo: string
    count: number
  }>
  tiempoPromedioResolucion: number
  fallasRecurrentes: FallaRecurrente[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/dashboard/stats")
      if (!response.ok) throw new Error("Error al cargar estadísticas")

      const data = await response.json()
      setStats(data)
    } catch (error) {
      toast.error("Error al cargar estadísticas del dashboard")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportExcel = () => {
    if (!stats) {
      toast.error("No hay datos para exportar")
      return
    }

    try {
      const dataToExport = {
        totalEquipos: stats.totalEquipos,
        equiposPorEstado: Object.entries(stats.equiposPorEstado).map(([estado, cantidad]) => ({
          estado,
          cantidad,
        })),
        totalMantenimientos: stats.totalMantenimientos,
        mantenimientosPorEstado: Object.entries(stats.mantenimientosPorEstado).map(
          ([estado, cantidad]) => ({ estado, cantidad })
        ),
        mantenimientosPorMes: chartData.map((item) => ({
          mes: item.mes,
          cantidad: item.preventivo + item.correctivo,
        })),
      }
      exportEstadisticasToExcel(dataToExport, "estadisticas_dashboard")
      toast.success("Estadísticas exportadas a Excel")
    } catch (error) {
      toast.error("Error al exportar a Excel")
    }
  }

  const handleExportPDF = () => {
    if (!stats) {
      toast.error("No hay datos para exportar")
      return
    }

    try {
      const dataToExport = {
        totalEquipos: stats.totalEquipos,
        equiposPorEstado: Object.entries(stats.equiposPorEstado).map(([estado, cantidad]) => ({
          estado,
          cantidad,
        })),
        totalMantenimientos: stats.totalMantenimientos,
        mantenimientosPorEstado: Object.entries(stats.mantenimientosPorEstado).map(
          ([estado, cantidad]) => ({ estado, cantidad })
        ),
        mantenimientosPorMes: chartData.map((item) => ({
          mes: item.mes,
          cantidad: item.preventivo + item.correctivo,
        })),
      }
      exportEstadisticasToPDF(dataToExport)
      toast.success("Estadísticas exportadas a PDF")
    } catch (error) {
      toast.error("Error al exportar a PDF")
    }
  }

  // Procesar datos para el gráfico
  const chartData = stats?.mantenimientosPorMes
    ? (() => {
        const mesesMap = new Map<string, { mes: string; preventivo: number; correctivo: number }>()

        stats.mantenimientosPorMes.forEach(item => {
          if (!mesesMap.has(item.mes)) {
            mesesMap.set(item.mes, { mes: item.mes, preventivo: 0, correctivo: 0 })
          }
          const mesData = mesesMap.get(item.mes)!
          if (item.tipo === "PREVENTIVO") {
            mesData.preventivo = item.count
          } else if (item.tipo === "CORRECTIVO") {
            mesData.correctivo = item.count
          }
        })

        return Array.from(mesesMap.values()).sort((a, b) => a.mes.localeCompare(b.mes))
      })()
    : []

  if (loading) {
    return (
      <>
        <Header
          title="Dashboard"
          description="Resumen general del sistema"
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Cargando estadísticas...</p>
            </div>
          </div>
        </main>
      </>
    )
  }

  if (!stats) {
    return (
      <>
        <Header
          title="Dashboard"
          description="Resumen general del sistema"
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No se pudieron cargar las estadísticas</p>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header
        title="Dashboard"
        description="Resumen general del sistema"
      />

      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Exportar Estadísticas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportExcel}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Exportar a Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF}>
                <FileDown className="mr-2 h-4 w-4" />
                Exportar a PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Metric Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <MetricCard
              title="Total Equipos"
              value={stats.totalEquipos.toString()}
              change={`${stats.equiposPorEstado.ACTIVO || 0} activos`}
              trend="up"
              icon={Wrench}
            />
            <MetricCard
              title="Pendientes"
              value={stats.mantenimientosPendientes.toString()}
              change={`${stats.cambioPendientes > 0 ? "+" : ""}${stats.cambioPendientes}%`}
              trend={stats.cambioPendientes > 0 ? "up" : "down"}
              icon={ClipboardList}
            />
            <MetricCard
              title="Completados (Mes)"
              value={stats.completadosEsteMes.toString()}
              change={`${stats.cambioCompletados > 0 ? "+" : ""}${stats.cambioCompletados}%`}
              trend={stats.cambioCompletados > 0 ? "up" : "down"}
              icon={BarChart3}
            />
            <MetricCard
              title="Equipos Críticos"
              value={stats.equiposCriticos.toString()}
              change={stats.equiposCriticos > 0 ? "Requieren atención" : "Todo bien"}
              trend={stats.equiposCriticos > 0 ? "critical" : "down"}
              icon={Bell}
            />
            <MetricCard
              title="Tiempo Promedio"
              value={`${stats.tiempoPromedioResolucion} días`}
              change="Resolución de mant."
              trend={stats.tiempoPromedioResolucion <= 3 ? "up" : stats.tiempoPromedioResolucion <= 7 ? "down" : "critical"}
              icon={Clock}
            />
            <MetricCard
              title="Fallas Recurrentes"
              value={stats.fallasRecurrentes.length.toString()}
              change={stats.fallasRecurrentes.length > 0 ? "Equipos con +2 fallas" : "Sin fallas recurrentes"}
              trend={stats.fallasRecurrentes.length > 0 ? "critical" : "up"}
              icon={AlertTriangle}
            />
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Mantenimientos por Mes</CardTitle>
              <p className="text-sm text-muted-foreground">Histórico de mantenimientos preventivos y correctivos (últimos 6 meses)</p>
            </CardHeader>
            <CardContent>
              <MaintenanceChart data={chartData} />
            </CardContent>
          </Card>

          {/* Two column layout for tables */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Maintenance Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Próximos Mantenimientos</CardTitle>
                <p className="text-sm text-muted-foreground">Mantenimientos programados y en proceso</p>
              </CardHeader>
              <CardContent>
                <MaintenanceTable data={stats.proximosMantenimientos} />
              </CardContent>
            </Card>

            {/* Fallas Recurrentes Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Fallas Recurrentes por Equipo
                </CardTitle>
                <p className="text-sm text-muted-foreground">Equipos con 2 o más mantenimientos correctivos</p>
              </CardHeader>
              <CardContent>
                {stats.fallasRecurrentes.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    No hay equipos con fallas recurrentes
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.fallasRecurrentes.map((falla) => (
                      <div
                        key={falla.equipoId}
                        className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">
                            {falla.equipo?.tipo} {falla.equipo?.marca} {falla.equipo?.modelo || ""}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Serial: {falla.equipo?.serial} | {falla.equipo?.empresa}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-destructive/10 px-3 py-1 text-sm font-semibold text-destructive">
                            {falla.cantidadFallas} fallas
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
