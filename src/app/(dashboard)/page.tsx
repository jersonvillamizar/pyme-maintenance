"use client"

import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricCard } from "@/components/metric-card"
import { MaintenanceChart } from "@/components/maintenance-chart"
import { MaintenanceTable } from "@/components/maintenance-table"
import { Wrench, ClipboardList, BarChart3, Bell } from "lucide-react"

export default function DashboardPage() {
  return (
    <>
      <Header
        title="Dashboard"
        description="Resumen general del sistema"
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Metric Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Total Equipos" value="247" change="+12" trend="up" icon={Wrench} />
            <MetricCard title="Mantenimientos Pendientes" value="18" change="-3" trend="down" icon={ClipboardList} />
            <MetricCard title="Completados Este Mes" value="64" change="+8" trend="up" icon={BarChart3} />
            <MetricCard title="Equipos Críticos" value="5" change="+2" trend="critical" icon={Bell} />
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Mantenimientos por Mes</CardTitle>
              <p className="text-sm text-muted-foreground">Histórico de mantenimientos preventivos y correctivos</p>
            </CardHeader>
            <CardContent>
              <MaintenanceChart />
            </CardContent>
          </Card>

          {/* Recent Maintenance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Mantenimientos Recientes</CardTitle>
              <p className="text-sm text-muted-foreground">Últimas actividades registradas en el sistema</p>
            </CardHeader>
            <CardContent>
              <MaintenanceTable />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
