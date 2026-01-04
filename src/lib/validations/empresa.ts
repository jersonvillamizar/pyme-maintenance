import { z } from "zod"

export const empresaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  nit: z.string().min(1, "El NIT es requerido").max(20, "Máximo 20 caracteres"),
  contacto: z.string().max(100, "Máximo 100 caracteres").optional().nullable(),
  telefono: z.string().max(20, "Máximo 20 caracteres").optional().nullable(),
  email: z.string().email("Email inválido").max(100, "Máximo 100 caracteres").optional().nullable(),
  direccion: z.string().max(200, "Máximo 200 caracteres").optional().nullable(),
})

export const updateEmpresaSchema = empresaSchema.partial()

export type EmpresaInput = z.infer<typeof empresaSchema>
export type UpdateEmpresaInput = z.infer<typeof updateEmpresaSchema>
