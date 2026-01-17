import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Extender el tipo jsPDF para incluir autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable
  }
}

/**
 * Configuración común para todos los PDFs
 */
function configurePDF(doc: jsPDF, title: string) {
  // Agregar título
  doc.setFontSize(18)
  doc.text(title, 14, 20)

  // Agregar fecha de generación
  doc.setFontSize(10)
  doc.text(
    `Generado: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}`,
    14,
    28
  )

  // Línea separadora
  doc.setDrawColor(200, 200, 200)
  doc.line(14, 32, doc.internal.pageSize.width - 14, 32)
}

/**
 * Agregar footer con número de página
 */
function addFooter(doc: jsPDF) {
  const pageCount = doc.internal.pages.length - 1
  doc.setFontSize(8)
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.text(
      `MantenPro - Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    )
  }
}

/**
 * Exporta equipos a PDF
 */
export function exportEquiposToPDF(equipos: any[]) {
  const doc = new jsPDF()
  configurePDF(doc, "Reporte de Equipos")

  // Preparar datos para la tabla
  const tableData = equipos.map((equipo) => [
    equipo.tipo,
    equipo.marca,
    equipo.modelo || "-",
    equipo.serial,
    equipo.estado,
    equipo.ubicacion || "-",
    equipo.empresa,
  ])

  // Crear tabla
  autoTable(doc, {
    startY: 38,
    head: [["Tipo", "Marca", "Modelo", "Serial", "Estado", "Ubicación", "Empresa"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [59, 130, 246], // Blue
      textColor: 255,
      fontSize: 9,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 30 },
      4: { cellWidth: 20 },
      5: { cellWidth: 30 },
      6: { cellWidth: 35 },
    },
    margin: { top: 38 },
  })

  addFooter(doc)

  // Descargar PDF
  const timestamp = format(new Date(), "yyyy-MM-dd_HHmm")
  doc.save(`equipos_${timestamp}.pdf`)
}

/**
 * Exporta mantenimientos a PDF
 */
export function exportMantenimientosToPDF(mantenimientos: any[]) {
  const doc = new jsPDF()
  configurePDF(doc, "Reporte de Mantenimientos")

  // Preparar datos para la tabla
  const tableData = mantenimientos.map((mant) => [
    mant.tipo,
    mant.estado,
    mant.equipo,
    mant.empresa,
    mant.tecnico,
    mant.fechaProgramada,
    mant.fechaRealizada || "-",
  ])

  // Crear tabla
  autoTable(doc, {
    startY: 38,
    head: [
      [
        "Tipo",
        "Estado",
        "Equipo",
        "Empresa",
        "Técnico",
        "F. Programada",
        "F. Realizada",
      ],
    ],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontSize: 9,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 25 },
      2: { cellWidth: 35 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 25 },
      6: { cellWidth: 25 },
    },
    margin: { top: 38 },
  })

  addFooter(doc)

  // Descargar PDF
  const timestamp = format(new Date(), "yyyy-MM-dd_HHmm")
  doc.save(`mantenimientos_${timestamp}.pdf`)
}

/**
 * Exporta historial a PDF
 */
export function exportHistorialToPDF(historial: any[], titulo?: string) {
  const doc = new jsPDF()
  configurePDF(doc, titulo || "Historial de Intervenciones")

  // Preparar datos para la tabla
  const tableData = historial.map((item) => [
    item.fecha,
    item.equipo,
    item.tipoMantenimiento,
    item.tecnico,
    item.observaciones,
  ])

  // Crear tabla
  autoTable(doc, {
    startY: 38,
    head: [["Fecha", "Equipo", "Tipo", "Técnico", "Observaciones"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontSize: 9,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 40 },
      2: { cellWidth: 25 },
      3: { cellWidth: 30 },
      4: { cellWidth: 60 },
    },
    margin: { top: 38 },
  })

  addFooter(doc)

  // Descargar PDF
  const timestamp = format(new Date(), "yyyy-MM-dd_HHmm")
  doc.save(`historial_${timestamp}.pdf`)
}

/**
 * Exporta estadísticas a PDF
 */
export function exportEstadisticasToPDF(stats: {
  totalEquipos: number
  equiposPorEstado: Array<{ estado: string; cantidad: number }>
  totalMantenimientos: number
  mantenimientosPorEstado: Array<{ estado: string; cantidad: number }>
  mantenimientosPorMes: Array<{ mes: string; cantidad: number }>
}) {
  const doc = new jsPDF()
  configurePDF(doc, "Estadísticas del Sistema")

  let currentY = 38

  // Resumen General
  doc.setFontSize(12)
  doc.setFont(undefined, "bold")
  doc.text("Resumen General", 14, currentY)
  currentY += 8

  autoTable(doc, {
    startY: currentY,
    head: [["Métrica", "Valor"]],
    body: [
      ["Total de Equipos", stats.totalEquipos.toString()],
      ["Total de Mantenimientos", stats.totalMantenimientos.toString()],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 80 },
    },
  })

  currentY = (doc as any).lastAutoTable.finalY + 10

  // Equipos por Estado
  doc.setFontSize(12)
  doc.setFont(undefined, "bold")
  doc.text("Equipos por Estado", 14, currentY)
  currentY += 8

  autoTable(doc, {
    startY: currentY,
    head: [["Estado", "Cantidad"]],
    body: stats.equiposPorEstado.map((e) => [e.estado, e.cantidad.toString()]),
    theme: "grid",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 80 },
    },
  })

  currentY = (doc as any).lastAutoTable.finalY + 10

  // Mantenimientos por Estado
  doc.setFontSize(12)
  doc.setFont(undefined, "bold")
  doc.text("Mantenimientos por Estado", 14, currentY)
  currentY += 8

  autoTable(doc, {
    startY: currentY,
    head: [["Estado", "Cantidad"]],
    body: stats.mantenimientosPorEstado.map((m) => [
      m.estado,
      m.cantidad.toString(),
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 80 },
    },
  })

  // Si hay espacio, agregar mantenimientos por mes
  currentY = (doc as any).lastAutoTable.finalY + 10
  if (currentY > doc.internal.pageSize.height - 60) {
    doc.addPage()
    currentY = 20
  }

  doc.setFontSize(12)
  doc.setFont(undefined, "bold")
  doc.text("Mantenimientos por Mes (Últimos 6 meses)", 14, currentY)
  currentY += 8

  autoTable(doc, {
    startY: currentY,
    head: [["Mes", "Cantidad"]],
    body: stats.mantenimientosPorMes.map((m) => [m.mes, m.cantidad.toString()]),
    theme: "grid",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 80 },
    },
  })

  addFooter(doc)

  // Descargar PDF
  const timestamp = format(new Date(), "yyyy-MM-dd_HHmm")
  doc.save(`estadisticas_${timestamp}.pdf`)
}
