import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida"),
})

export const createSocioSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  telefono: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  direccion: z.string().optional(),
})

export const createParcelaSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  hectareas: z.number().positive("Hectáreas debe ser positivo"),
  ubicacion: z.string().optional(),
  coordenadas: z.string().optional(),
})

export const createCosechaSchema = z.object({
  parcelaId: z.string().optional(),
  cultivo: z.enum(["MAIZ", "TRIGO", "CEBADA"]),
  rendimiento: z.number().optional(),
  fechaSiembra: z.string().optional(),
  fechaCosecha: z.string().optional(),
})

export const createEntradaSchema = z.object({
  peso: z.number().positive("Peso debe ser positivo").max(50000, "Peso máximo 50,000 kg"),
  humedad: z.number().min(0, "Mínimo 0%").max(100, "Máximo 100%"),
  pesoEspecifico: z.number().positive("Peso específico debe ser positivo").min(0.5).max(1.5),
  temperatura: z.number().min(-20, "Mínimo -20°C").max(60, "Máximo 60°C"),
  impurezas: z.number().min(0, "Mínimo 0%").max(100, "Máximo 100%"),
})

export const createFrutaSchema = z.object({
  especie: z.enum(["MELOCOTON", "NECTARINA", "ALBARICOQUE", "CIRUELA"]),
  variedad: z.string().optional(),
  calibre: z.enum(["AA", "A", "B", "C"]),
  azucar: z.number().min(0, "Mínimo 0°").max(30, "Máximo 30° Brix"),
  dureza: z.number().positive("Dureza debe ser positiva").min(0).max(20),
  defectos: z.number().min(0, "Mínimo 0%").max(100, "Máximo 100%"),
  observaciones: z.string().optional(),
})

export const createLiquidacionSchema = z.object({
  socioId: z.string().uuid("ID de socio inválido"),
  cosechaId: z.string().uuid("ID de cosecha inválido").optional(),
  totalKilos: z.number().positive("Kilos debe ser positivo"),
  precioBase: z.number().positive("Precio base debe ser positivo"),
})

export const createSiloSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  capacidad: z.number().positive("Capacidad debe ser positiva"),
  cultivo: z.enum(["MAIZ", "TRIGO", "CEBADA"]).optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type CreateSocioFormData = z.infer<typeof createSocioSchema>
export type CreateParcelaFormData = z.infer<typeof createParcelaSchema>
export type CreateCosechaFormData = z.infer<typeof createCosechaSchema>
export type CreateEntradaFormData = z.infer<typeof createEntradaSchema>
export type CreateFrutaFormData = z.infer<typeof createFrutaSchema>
export type CreateLiquidacionFormData = z.infer<typeof createLiquidacionSchema>
export type CreateSiloFormData = z.infer<typeof createSiloSchema>
