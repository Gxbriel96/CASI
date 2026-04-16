import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "Password requerido"),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Password mínimo 6 caracteres"),
    nombre: z.string().min(1, "Nombre requerido"),
    rol: z.enum(["ADMIN", "EMPLEADO", "SOCIO"]).optional(),
  }),
});

export const createSocioSchema = z.object({
  body: z.object({
    nombre: z.string().min(1, "Nombre requerido"),
    telefono: z.string().optional(),
    email: z.string().email("Email inválido").optional(),
    direccion: z.string().optional(),
  }),
});

export const updateSocioSchema = z.object({
  body: z.object({
    nombre: z.string().min(1).optional(),
    telefono: z.string().optional(),
    email: z.string().email().optional(),
    direccion: z.string().optional(),
  }),
});

export const createParcelaSchema = z.object({
  body: z.object({
    socioId: z.string().uuid("ID de socio inválido"),
    nombre: z.string().min(1, "Nombre requerido"),
    hectareas: z.number().positive("Hectáreas debe ser positivo"),
    ubicacion: z.string().optional(),
    coordenadas: z.string().optional(),
  }),
});

export const updateParcelaSchema = z.object({
  body: z.object({
    nombre: z.string().min(1).optional(),
    hectareas: z.number().positive().optional(),
    ubicacion: z.string().optional(),
    coordenadas: z.string().optional(),
  }),
});

export const createCosechaSchema = z.object({
  body: z.object({
    parcelaId: z.string().uuid("ID de parcela inválido"),
    cultivo: z.enum(["MAIZ", "TRIGO", "CEBADA"]),
    rendimiento: z.number().optional(),
    fechaSiembra: z.string().datetime().optional(),
    fechaCosecha: z.string().datetime().optional(),
  }),
});

export const createEntradaSchema = z.object({
  body: z.object({
    socioId: z.string().uuid("ID de socio inválido"),
    cosechaId: z.string().uuid().optional(),
    siloId: z.string().uuid().optional(),
    peso: z.number().positive("Peso debe ser positivo"),
    humedad: z.number().min(0).max(100, "Humedad entre 0 y 100"),
    pesoEspecifico: z.number().positive("Peso específico debe ser positivo"),
    temperatura: z.number().min(-20).max(60, "Temperatura entre -20 y 60"),
    impurezas: z.number().min(0).max(100, "Impurezas entre 0 y 100"),
  }),
});

export const updateEntradaSchema = z.object({
  body: z.object({
    siloId: z.string().uuid().optional(),
    peso: z.number().positive().optional(),
  }),
});

export const createControlCalidadSchema = z.object({
  body: z.object({
    entradaAlmacenId: z.string().uuid("ID de entrada inválido"),
    humedad: z.number().min(0).max(100),
    pesoEspecifico: z.number().positive(),
    temperatura: z.number().min(-20).max(60),
    impurezas: z.number().min(0).max(100),
    observaciones: z.string().optional(),
  }),
});

export const updateControlCalidadSchema = z.object({
  body: z.object({
    resultado: z.enum(["APROBADO", "RECHAZADO"]),
    observaciones: z.string().optional(),
  }),
});

export const createFrutaSchema = z.object({
  body: z.object({
    socioId: z.string().uuid("ID de socio inválido"),
    especie: z.enum(["MELOCOTON", "NECTARINA", "ALBARICOQUE", "CIRUELA"]),
    variedad: z.string().optional(),
    calibre: z.enum(["AA", "A", "B", "C"]),
    azucar: z.number().min(0).max(30, "Azúcar entre 0 y 30"),
    dureza: z.number().positive("Dureza debe ser positiva"),
    defectos: z.number().min(0).max(100, "Defectos entre 0 y 100"),
    observaciones: z.string().optional(),
  }),
});

export const createSiloSchema = z.object({
  body: z.object({
    nombre: z.string().min(1, "Nombre requerido"),
    capacidad: z.number().positive("Capacidad debe ser positiva"),
    cultivo: z.enum(["MAIZ", "TRIGO", "CEBADA"]).optional(),
  }),
});

export const updateSiloSchema = z.object({
  body: z.object({
    nombre: z.string().min(1).optional(),
    capacidad: z.number().positive().optional(),
    cultivo: z.enum(["MAIZ", "TRIGO", "CEBADA"]).optional(),
  }),
});

export const createLiquidacionSchema = z.object({
  body: z.object({
    socioId: z.string().uuid("ID de socio inválido"),
    cosechaId: z.string().uuid().optional(),
    totalKilos: z.number().positive("Kilos debe ser positivo"),
    precioBase: z.number().positive("Precio base debe ser positivo"),
  }),
});

export const calcularLiquidacionSchema = z.object({
  body: z.object({
    socioId: z.string().uuid("ID de socio inválido"),
    cosechaId: z.string().uuid().optional(),
  }),
});

export const createCampanaSchema = z.object({
  body: z.object({
    nombre: z.string().min(1, "Nombre requerido"),
    precioBaseMaiz: z.number().positive("Precio base maíz debe ser positivo"),
    precioBaseTrigo: z.number().positive("Precio base trigo debe ser positivo"),
    porcentajeApoyo: z.number().min(0).max(100, "Porcentaje entre 0 y 100"),
    fechaInicio: z.string().datetime("Fecha de inicio inválida"),
    fechaFin: z.string().datetime("Fecha de fin inválida"),
  }),
});

export const paginationSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).pipe(z.number().min(1)).default("1"),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default("10"),
    search: z.string().optional(),
  }),
});