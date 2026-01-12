import { z } from "zod"

export const equipoSchema = z.object({
  tipo: z.string().min(1, "El tipo es requerido").max(50, "Máximo 50 caracteres"),
  marca: z.string().min(1, "La marca es requerida").max(50, "Máximo 50 caracteres"),
  modelo: z.string().max(50, "Máximo 50 caracteres").optional().nullable(),
  serial: z.string().min(1, "El serial es requerido").max(100, "Máximo 100 caracteres"),
  estado: z.enum(["ACTIVO", "INACTIVO", "EN_MANTENIMIENTO", "DADO_DE_BAJA"], {
    required_error: "El estado es requerido",
  }),
  ubicacion: z.string().max(200, "Máximo 200 caracteres").optional().nullable(),
  empresaId: z.string().min(1, "La empresa es requerida"),
})

export const updateEquipoSchema = equipoSchema.partial().extend({
  empresaId: z.string().optional(),
})

export type EquipoInput = z.infer<typeof equipoSchema>
export type UpdateEquipoInput = z.infer<typeof updateEquipoSchema>
