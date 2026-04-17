"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = exports.createCampanaSchema = exports.calcularLiquidacionSchema = exports.createLiquidacionSchema = exports.updateSiloSchema = exports.createSiloSchema = exports.createFrutaSchema = exports.updateControlCalidadSchema = exports.createControlCalidadSchema = exports.updateEntradaSchema = exports.createEntradaSchema = exports.createCosechaSchema = exports.updateParcelaSchema = exports.createParcelaSchema = exports.updateSocioSchema = exports.createSocioSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Email inválido"),
        password: zod_1.z.string().min(1, "Password requerido"),
    }),
});
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Email inválido"),
        password: zod_1.z.string().min(6, "Password mínimo 6 caracteres"),
        nombre: zod_1.z.string().min(1, "Nombre requerido"),
        rol: zod_1.z.enum(["ADMIN", "EMPLEADO", "SOCIO"]).optional(),
    }),
});
exports.createSocioSchema = zod_1.z.object({
    body: zod_1.z.object({
        nombre: zod_1.z.string().min(1, "Nombre requerido"),
        telefono: zod_1.z.string().optional(),
        email: zod_1.z.string().email("Email inválido").optional(),
        direccion: zod_1.z.string().optional(),
    }),
});
exports.updateSocioSchema = zod_1.z.object({
    body: zod_1.z.object({
        nombre: zod_1.z.string().min(1).optional(),
        telefono: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        direccion: zod_1.z.string().optional(),
    }),
});
exports.createParcelaSchema = zod_1.z.object({
    body: zod_1.z.object({
        socioId: zod_1.z.string().uuid("ID de socio inválido"),
        nombre: zod_1.z.string().min(1, "Nombre requerido"),
        hectareas: zod_1.z.number().positive("Hectáreas debe ser positivo"),
        ubicacion: zod_1.z.string().optional(),
        coordenadas: zod_1.z.string().optional(),
    }),
});
exports.updateParcelaSchema = zod_1.z.object({
    body: zod_1.z.object({
        nombre: zod_1.z.string().min(1).optional(),
        hectareas: zod_1.z.number().positive().optional(),
        ubicacion: zod_1.z.string().optional(),
        coordenadas: zod_1.z.string().optional(),
    }),
});
exports.createCosechaSchema = zod_1.z.object({
    body: zod_1.z.object({
        parcelaId: zod_1.z.string().uuid("ID de parcela inválido"),
        cultivo: zod_1.z.enum(["MAIZ", "TRIGO", "CEBADA"]),
        rendimiento: zod_1.z.number().optional(),
        fechaSiembra: zod_1.z.string().datetime().optional(),
        fechaCosecha: zod_1.z.string().datetime().optional(),
    }),
});
exports.createEntradaSchema = zod_1.z.object({
    body: zod_1.z.object({
        socioId: zod_1.z.string().uuid("ID de socio inválido"),
        cosechaId: zod_1.z.string().uuid().optional(),
        siloId: zod_1.z.string().uuid().optional(),
        peso: zod_1.z.number().positive("Peso debe ser positivo"),
        humedad: zod_1.z.number().min(0).max(100, "Humedad entre 0 y 100"),
        pesoEspecifico: zod_1.z.number().positive("Peso específico debe ser positivo"),
        temperatura: zod_1.z.number().min(-20).max(60, "Temperatura entre -20 y 60"),
        impurezas: zod_1.z.number().min(0).max(100, "Impurezas entre 0 y 100"),
    }),
});
exports.updateEntradaSchema = zod_1.z.object({
    body: zod_1.z.object({
        siloId: zod_1.z.string().uuid().optional(),
        peso: zod_1.z.number().positive().optional(),
    }),
});
exports.createControlCalidadSchema = zod_1.z.object({
    body: zod_1.z.object({
        entradaAlmacenId: zod_1.z.string().uuid("ID de entrada inválido"),
        humedad: zod_1.z.number().min(0).max(100),
        pesoEspecifico: zod_1.z.number().positive(),
        temperatura: zod_1.z.number().min(-20).max(60),
        impurezas: zod_1.z.number().min(0).max(100),
        observaciones: zod_1.z.string().optional(),
    }),
});
exports.updateControlCalidadSchema = zod_1.z.object({
    body: zod_1.z.object({
        resultado: zod_1.z.enum(["APROBADO", "RECHAZADO"]),
        observaciones: zod_1.z.string().optional(),
    }),
});
exports.createFrutaSchema = zod_1.z.object({
    body: zod_1.z.object({
        socioId: zod_1.z.string().uuid("ID de socio inválido"),
        especie: zod_1.z.enum(["MELOCOTON", "NECTARINA", "ALBARICOQUE", "CIRUELA"]),
        variedad: zod_1.z.string().optional(),
        calibre: zod_1.z.enum(["AA", "A", "B", "C"]),
        azucar: zod_1.z.number().min(0).max(30, "Azúcar entre 0 y 30"),
        dureza: zod_1.z.number().positive("Dureza debe ser positiva"),
        defectos: zod_1.z.number().min(0).max(100, "Defectos entre 0 y 100"),
        observaciones: zod_1.z.string().optional(),
    }),
});
exports.createSiloSchema = zod_1.z.object({
    body: zod_1.z.object({
        nombre: zod_1.z.string().min(1, "Nombre requerido"),
        capacidad: zod_1.z.number().positive("Capacidad debe ser positiva"),
        cultivo: zod_1.z.enum(["MAIZ", "TRIGO", "CEBADA"]).optional(),
    }),
});
exports.updateSiloSchema = zod_1.z.object({
    body: zod_1.z.object({
        nombre: zod_1.z.string().min(1).optional(),
        capacidad: zod_1.z.number().positive().optional(),
        cultivo: zod_1.z.enum(["MAIZ", "TRIGO", "CEBADA"]).optional(),
    }),
});
exports.createLiquidacionSchema = zod_1.z.object({
    body: zod_1.z.object({
        socioId: zod_1.z.string().uuid("ID de socio inválido"),
        cosechaId: zod_1.z.string().uuid().optional(),
        totalKilos: zod_1.z.number().positive("Kilos debe ser positivo"),
        precioBase: zod_1.z.number().positive("Precio base debe ser positivo"),
    }),
});
exports.calcularLiquidacionSchema = zod_1.z.object({
    body: zod_1.z.object({
        socioId: zod_1.z.string().uuid("ID de socio inválido"),
        cosechaId: zod_1.z.string().uuid().optional(),
    }),
});
exports.createCampanaSchema = zod_1.z.object({
    body: zod_1.z.object({
        nombre: zod_1.z.string().min(1, "Nombre requerido"),
        precioBaseMaiz: zod_1.z.number().positive("Precio base maíz debe ser positivo"),
        precioBaseTrigo: zod_1.z.number().positive("Precio base trigo debe ser positivo"),
        porcentajeApoyo: zod_1.z.number().min(0).max(100, "Porcentaje entre 0 y 100"),
        fechaInicio: zod_1.z.string().datetime("Fecha de inicio inválida"),
        fechaFin: zod_1.z.string().datetime("Fecha de fin inválida"),
    }),
});
exports.paginationSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1)).default("1"),
        limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1).max(100)).default("10"),
        search: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=schemas.js.map