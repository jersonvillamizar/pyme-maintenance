"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface CambiarEstadoDialogProps {
  mantenimientoId: string | null
  estadoActual: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const estadoOptions = [
  { value: "PROGRAMADO", label: "Programado" },
  { value: "EN_PROCESO", label: "En Proceso" },
  { value: "COMPLETADO", label: "Completado" },
  { value: "CANCELADO", label: "Cancelado" },
]

export function CambiarEstadoDialog({
  mantenimientoId,
  estadoActual,
  open,
  onOpenChange,
  onSuccess,
}: CambiarEstadoDialogProps) {
  const [estado, setEstado] = useState(estadoActual)
  const [observaciones, setObservaciones] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!mantenimientoId) return

    if (estado === estadoActual) {
      toast.error("Selecciona un estado diferente al actual")
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/api/mantenimientos/${mantenimientoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado,
          observaciones: observaciones || null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al cambiar estado")
      }

      toast.success(`Estado cambiado a: ${estadoOptions.find(o => o.value === estado)?.label}`)
      onOpenChange(false)
      setObservaciones("")
      onSuccess()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al cambiar estado")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value) {
        setObservaciones("")
        setEstado(estadoActual)
      }
      onOpenChange(value)
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cambiar Estado</DialogTitle>
          <DialogDescription>
            Actualiza el estado de este mantenimiento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nuevo Estado</Label>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {estadoOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Observaciones (opcional)</Label>
            <Textarea
              placeholder="Notas sobre el cambio de estado..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
