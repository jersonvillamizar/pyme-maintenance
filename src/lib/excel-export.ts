import * as XLSX from "xlsx"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Tipos para los datos que vamos a exportar
interface ExportEquipo {
  tipo: string
  marca: string
  modelo: string | null
  serial: string
  estado: string
  ubicacion: string | null
  empresa: string
}

interface ExportMantenimiento {
  tipo: string
  estado: string
  equipo: string
  empresa: string
  tecnico: string
  fechaProgramada: string
  fechaRealizada: string | null
  descripcion: string
  observaciones: string | null
}

interface ExportHistorial {
  fecha: string
  equipo: string
  tipoMantenimiento: string
  tecnico: string
  observaciones: string
}

/**
 * Exporta un array de equipos a un archivo Excel
 */
export function exportEquiposToExcel(equipos: ExportEquipo[], fileName: string = "equipos") {
  // Transformar datos para la exportación
  const data = equipos.map((equipo) => ({
    Tipo: equipo.tipo,
    Marca: equipo.marca,
    Modelo: equipo.modelo || "-",
    Serial: equipo.serial,
    Estado: equipo.estado,
    Ubicación: equipo.ubicacion || "-",
    Empresa: equipo.empresa,
  }))

  // Crear worksheet
  const worksheet = XLSX.utils.json_to_sheet(data)

  // Ajustar ancho de columnas
  const columnWidths = [
    { wch: 15 }, // Tipo
    { wch: 15 }, // Marca
    { wch: 15 }, // Modelo
    { wch: 20 }, // Serial
    { wch: 15 }, // Estado
    { wch: 25 }, // Ubicación
    { wch: 30 }, // Empresa
  ]
  worksheet["!cols"] = columnWidths

  // Crear workbook y agregar worksheet
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Equipos")

  // Agregar metadata
  workbook.Props = {
    Title: "Reporte de Equipos",
    Subject: "Equipos registrados en el sistema",
    Author: "MantenPro",
    CreatedDate: new Date(),
  }

  // Generar archivo
  const timestamp = format(new Date(), "yyyy-MM-dd_HHmm")
  XLSX.writeFile(workbook, `${fileName}_${timestamp}.xlsx`)
}

/**
 * Exporta un array de mantenimientos a un archivo Excel
 */
export function exportMantenimientosToExcel(
  mantenimientos: ExportMantenimiento[],
  fileName: string = "mantenimientos"
) {
  // Transformar datos para la exportación
  const data = mantenimientos.map((mant) => ({
    Tipo: mant.tipo,
    Estado: mant.estado,
    Equipo: mant.equipo,
    Empresa: mant.empresa,
    Técnico: mant.tecnico,
    "Fecha Programada": mant.fechaProgramada,
    "Fecha Realizada": mant.fechaRealizada || "-",
    Descripción: mant.descripcion,
    Observaciones: mant.observaciones || "-",
  }))

  // Crear worksheet
  const worksheet = XLSX.utils.json_to_sheet(data)

  // Ajustar ancho de columnas
  const columnWidths = [
    { wch: 12 }, // Tipo
    { wch: 12 }, // Estado
    { wch: 30 }, // Equipo
    { wch: 25 }, // Empresa
    { wch: 20 }, // Técnico
    { wch: 15 }, // Fecha Programada
    { wch: 15 }, // Fecha Realizada
    { wch: 40 }, // Descripción
    { wch: 40 }, // Observaciones
  ]
  worksheet["!cols"] = columnWidths

  // Crear workbook y agregar worksheet
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Mantenimientos")

  // Agregar metadata
  workbook.Props = {
    Title: "Reporte de Mantenimientos",
    Subject: "Mantenimientos registrados en el sistema",
    Author: "MantenPro",
    CreatedDate: new Date(),
  }

  // Generar archivo
  const timestamp = format(new Date(), "yyyy-MM-dd_HHmm")
  XLSX.writeFile(workbook, `${fileName}_${timestamp}.xlsx`)
}

/**
 * Exporta un array de historiales a un archivo Excel
 */
export function exportHistorialToExcel(
  historial: ExportHistorial[],
  fileName: string = "historial"
) {
  // Transformar datos para la exportación
  const data = historial.map((item) => ({
    Fecha: item.fecha,
    Equipo: item.equipo,
    "Tipo de Mantenimiento": item.tipoMantenimiento,
    Técnico: item.tecnico,
    Observaciones: item.observaciones,
  }))

  // Crear worksheet
  const worksheet = XLSX.utils.json_to_sheet(data)

  // Ajustar ancho de columnas
  const columnWidths = [
    { wch: 18 }, // Fecha
    { wch: 30 }, // Equipo
    { wch: 18 }, // Tipo de Mantenimiento
    { wch: 20 }, // Técnico
    { wch: 50 }, // Observaciones
  ]
  worksheet["!cols"] = columnWidths

  // Crear workbook y agregar worksheet
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Historial")

  // Agregar metadata
  workbook.Props = {
    Title: "Historial de Mantenimientos",
    Subject: "Historial de intervenciones",
    Author: "MantenPro",
    CreatedDate: new Date(),
  }

  // Generar archivo
  const timestamp = format(new Date(), "yyyy-MM-dd_HHmm")
  XLSX.writeFile(workbook, `${fileName}_${timestamp}.xlsx`)
}

/**
 * Exporta estadísticas del dashboard a Excel
 */
export function exportEstadisticasToExcel(
  stats: {
    totalEquipos: number
    equiposPorEstado: Array<{ estado: string; cantidad: number }>
    totalMantenimientos: number
    mantenimientosPorEstado: Array<{ estado: string; cantidad: number }>
    mantenimientosPorMes: Array<{ mes: string; cantidad: number }>
  },
  fileName: string = "estadisticas"
) {
  const workbook = XLSX.utils.book_new()

  // Sheet 1: Resumen
  const resumenData = [
    { Métrica: "Total de Equipos", Valor: stats.totalEquipos },
    { Métrica: "Total de Mantenimientos", Valor: stats.totalMantenimientos },
  ]
  const wsResumen = XLSX.utils.json_to_sheet(resumenData)
  wsResumen["!cols"] = [{ wch: 25 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(workbook, wsResumen, "Resumen")

  // Sheet 2: Equipos por Estado
  const wsEquipos = XLSX.utils.json_to_sheet(
    stats.equiposPorEstado.map((e) => ({
      Estado: e.estado,
      Cantidad: e.cantidad,
    }))
  )
  wsEquipos["!cols"] = [{ wch: 20 }, { wch: 12 }]
  XLSX.utils.book_append_sheet(workbook, wsEquipos, "Equipos por Estado")

  // Sheet 3: Mantenimientos por Estado
  const wsMantEstado = XLSX.utils.json_to_sheet(
    stats.mantenimientosPorEstado.map((m) => ({
      Estado: m.estado,
      Cantidad: m.cantidad,
    }))
  )
  wsMantEstado["!cols"] = [{ wch: 20 }, { wch: 12 }]
  XLSX.utils.book_append_sheet(workbook, wsMantEstado, "Mantenimientos por Estado")

  // Sheet 4: Mantenimientos por Mes
  const wsMantMes = XLSX.utils.json_to_sheet(
    stats.mantenimientosPorMes.map((m) => ({
      Mes: m.mes,
      Cantidad: m.cantidad,
    }))
  )
  wsMantMes["!cols"] = [{ wch: 15 }, { wch: 12 }]
  XLSX.utils.book_append_sheet(workbook, wsMantMes, "Mantenimientos por Mes")

  // Agregar metadata
  workbook.Props = {
    Title: "Estadísticas del Sistema",
    Subject: "Reporte de estadísticas y métricas",
    Author: "MantenPro",
    CreatedDate: new Date(),
  }

  // Generar archivo
  const timestamp = format(new Date(), "yyyy-MM-dd_HHmm")
  XLSX.writeFile(workbook, `${fileName}_${timestamp}.xlsx`)
}
