import { z } from "zod";
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
    }, {
        email: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
    };
}, {
    body: {
        email: string;
        password: string;
    };
}>;
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        nombre: z.ZodString;
        rol: z.ZodOptional<z.ZodEnum<["ADMIN", "EMPLEADO", "SOCIO"]>>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
        nombre: string;
        rol?: "ADMIN" | "EMPLEADO" | "SOCIO" | undefined;
    }, {
        email: string;
        password: string;
        nombre: string;
        rol?: "ADMIN" | "EMPLEADO" | "SOCIO" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
        nombre: string;
        rol?: "ADMIN" | "EMPLEADO" | "SOCIO" | undefined;
    };
}, {
    body: {
        email: string;
        password: string;
        nombre: string;
        rol?: "ADMIN" | "EMPLEADO" | "SOCIO" | undefined;
    };
}>;
export declare const createSocioSchema: z.ZodObject<{
    body: z.ZodObject<{
        nombre: z.ZodString;
        telefono: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        direccion: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        nombre: string;
        email?: string | undefined;
        telefono?: string | undefined;
        direccion?: string | undefined;
    }, {
        nombre: string;
        email?: string | undefined;
        telefono?: string | undefined;
        direccion?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        nombre: string;
        email?: string | undefined;
        telefono?: string | undefined;
        direccion?: string | undefined;
    };
}, {
    body: {
        nombre: string;
        email?: string | undefined;
        telefono?: string | undefined;
        direccion?: string | undefined;
    };
}>;
export declare const updateSocioSchema: z.ZodObject<{
    body: z.ZodObject<{
        nombre: z.ZodOptional<z.ZodString>;
        telefono: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        direccion: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        nombre?: string | undefined;
        telefono?: string | undefined;
        direccion?: string | undefined;
    }, {
        email?: string | undefined;
        nombre?: string | undefined;
        telefono?: string | undefined;
        direccion?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email?: string | undefined;
        nombre?: string | undefined;
        telefono?: string | undefined;
        direccion?: string | undefined;
    };
}, {
    body: {
        email?: string | undefined;
        nombre?: string | undefined;
        telefono?: string | undefined;
        direccion?: string | undefined;
    };
}>;
export declare const createParcelaSchema: z.ZodObject<{
    body: z.ZodObject<{
        socioId: z.ZodString;
        nombre: z.ZodString;
        hectareas: z.ZodNumber;
        ubicacion: z.ZodOptional<z.ZodString>;
        coordenadas: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        nombre: string;
        socioId: string;
        hectareas: number;
        ubicacion?: string | undefined;
        coordenadas?: string | undefined;
    }, {
        nombre: string;
        socioId: string;
        hectareas: number;
        ubicacion?: string | undefined;
        coordenadas?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        nombre: string;
        socioId: string;
        hectareas: number;
        ubicacion?: string | undefined;
        coordenadas?: string | undefined;
    };
}, {
    body: {
        nombre: string;
        socioId: string;
        hectareas: number;
        ubicacion?: string | undefined;
        coordenadas?: string | undefined;
    };
}>;
export declare const updateParcelaSchema: z.ZodObject<{
    body: z.ZodObject<{
        nombre: z.ZodOptional<z.ZodString>;
        hectareas: z.ZodOptional<z.ZodNumber>;
        ubicacion: z.ZodOptional<z.ZodString>;
        coordenadas: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        nombre?: string | undefined;
        hectareas?: number | undefined;
        ubicacion?: string | undefined;
        coordenadas?: string | undefined;
    }, {
        nombre?: string | undefined;
        hectareas?: number | undefined;
        ubicacion?: string | undefined;
        coordenadas?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        nombre?: string | undefined;
        hectareas?: number | undefined;
        ubicacion?: string | undefined;
        coordenadas?: string | undefined;
    };
}, {
    body: {
        nombre?: string | undefined;
        hectareas?: number | undefined;
        ubicacion?: string | undefined;
        coordenadas?: string | undefined;
    };
}>;
export declare const createCosechaSchema: z.ZodObject<{
    body: z.ZodObject<{
        parcelaId: z.ZodString;
        cultivo: z.ZodEnum<["MAIZ", "TRIGO", "CEBADA"]>;
        rendimiento: z.ZodOptional<z.ZodNumber>;
        fechaSiembra: z.ZodOptional<z.ZodString>;
        fechaCosecha: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        parcelaId: string;
        cultivo: "MAIZ" | "TRIGO" | "CEBADA";
        rendimiento?: number | undefined;
        fechaSiembra?: string | undefined;
        fechaCosecha?: string | undefined;
    }, {
        parcelaId: string;
        cultivo: "MAIZ" | "TRIGO" | "CEBADA";
        rendimiento?: number | undefined;
        fechaSiembra?: string | undefined;
        fechaCosecha?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        parcelaId: string;
        cultivo: "MAIZ" | "TRIGO" | "CEBADA";
        rendimiento?: number | undefined;
        fechaSiembra?: string | undefined;
        fechaCosecha?: string | undefined;
    };
}, {
    body: {
        parcelaId: string;
        cultivo: "MAIZ" | "TRIGO" | "CEBADA";
        rendimiento?: number | undefined;
        fechaSiembra?: string | undefined;
        fechaCosecha?: string | undefined;
    };
}>;
export declare const createEntradaSchema: z.ZodObject<{
    body: z.ZodObject<{
        socioId: z.ZodString;
        cosechaId: z.ZodOptional<z.ZodString>;
        siloId: z.ZodOptional<z.ZodString>;
        peso: z.ZodNumber;
        humedad: z.ZodNumber;
        pesoEspecifico: z.ZodNumber;
        temperatura: z.ZodNumber;
        impurezas: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        socioId: string;
        peso: number;
        humedad: number;
        pesoEspecifico: number;
        temperatura: number;
        impurezas: number;
        cosechaId?: string | undefined;
        siloId?: string | undefined;
    }, {
        socioId: string;
        peso: number;
        humedad: number;
        pesoEspecifico: number;
        temperatura: number;
        impurezas: number;
        cosechaId?: string | undefined;
        siloId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        socioId: string;
        peso: number;
        humedad: number;
        pesoEspecifico: number;
        temperatura: number;
        impurezas: number;
        cosechaId?: string | undefined;
        siloId?: string | undefined;
    };
}, {
    body: {
        socioId: string;
        peso: number;
        humedad: number;
        pesoEspecifico: number;
        temperatura: number;
        impurezas: number;
        cosechaId?: string | undefined;
        siloId?: string | undefined;
    };
}>;
export declare const updateEntradaSchema: z.ZodObject<{
    body: z.ZodObject<{
        siloId: z.ZodOptional<z.ZodString>;
        peso: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        siloId?: string | undefined;
        peso?: number | undefined;
    }, {
        siloId?: string | undefined;
        peso?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        siloId?: string | undefined;
        peso?: number | undefined;
    };
}, {
    body: {
        siloId?: string | undefined;
        peso?: number | undefined;
    };
}>;
export declare const createControlCalidadSchema: z.ZodObject<{
    body: z.ZodObject<{
        entradaAlmacenId: z.ZodString;
        humedad: z.ZodNumber;
        pesoEspecifico: z.ZodNumber;
        temperatura: z.ZodNumber;
        impurezas: z.ZodNumber;
        observaciones: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        humedad: number;
        pesoEspecifico: number;
        temperatura: number;
        impurezas: number;
        entradaAlmacenId: string;
        observaciones?: string | undefined;
    }, {
        humedad: number;
        pesoEspecifico: number;
        temperatura: number;
        impurezas: number;
        entradaAlmacenId: string;
        observaciones?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        humedad: number;
        pesoEspecifico: number;
        temperatura: number;
        impurezas: number;
        entradaAlmacenId: string;
        observaciones?: string | undefined;
    };
}, {
    body: {
        humedad: number;
        pesoEspecifico: number;
        temperatura: number;
        impurezas: number;
        entradaAlmacenId: string;
        observaciones?: string | undefined;
    };
}>;
export declare const updateControlCalidadSchema: z.ZodObject<{
    body: z.ZodObject<{
        resultado: z.ZodEnum<["APROBADO", "RECHAZADO"]>;
        observaciones: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        resultado: "APROBADO" | "RECHAZADO";
        observaciones?: string | undefined;
    }, {
        resultado: "APROBADO" | "RECHAZADO";
        observaciones?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        resultado: "APROBADO" | "RECHAZADO";
        observaciones?: string | undefined;
    };
}, {
    body: {
        resultado: "APROBADO" | "RECHAZADO";
        observaciones?: string | undefined;
    };
}>;
export declare const createFrutaSchema: z.ZodObject<{
    body: z.ZodObject<{
        socioId: z.ZodString;
        especie: z.ZodEnum<["MELOCOTON", "NECTARINA", "ALBARICOQUE", "CIRUELA"]>;
        variedad: z.ZodOptional<z.ZodString>;
        calibre: z.ZodEnum<["AA", "A", "B", "C"]>;
        azucar: z.ZodNumber;
        dureza: z.ZodNumber;
        defectos: z.ZodNumber;
        observaciones: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        socioId: string;
        especie: "MELOCOTON" | "NECTARINA" | "ALBARICOQUE" | "CIRUELA";
        calibre: "AA" | "A" | "B" | "C";
        azucar: number;
        dureza: number;
        defectos: number;
        variedad?: string | undefined;
        observaciones?: string | undefined;
    }, {
        socioId: string;
        especie: "MELOCOTON" | "NECTARINA" | "ALBARICOQUE" | "CIRUELA";
        calibre: "AA" | "A" | "B" | "C";
        azucar: number;
        dureza: number;
        defectos: number;
        variedad?: string | undefined;
        observaciones?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        socioId: string;
        especie: "MELOCOTON" | "NECTARINA" | "ALBARICOQUE" | "CIRUELA";
        calibre: "AA" | "A" | "B" | "C";
        azucar: number;
        dureza: number;
        defectos: number;
        variedad?: string | undefined;
        observaciones?: string | undefined;
    };
}, {
    body: {
        socioId: string;
        especie: "MELOCOTON" | "NECTARINA" | "ALBARICOQUE" | "CIRUELA";
        calibre: "AA" | "A" | "B" | "C";
        azucar: number;
        dureza: number;
        defectos: number;
        variedad?: string | undefined;
        observaciones?: string | undefined;
    };
}>;
export declare const createSiloSchema: z.ZodObject<{
    body: z.ZodObject<{
        nombre: z.ZodString;
        capacidad: z.ZodNumber;
        cultivo: z.ZodOptional<z.ZodEnum<["MAIZ", "TRIGO", "CEBADA"]>>;
    }, "strip", z.ZodTypeAny, {
        nombre: string;
        capacidad: number;
        cultivo?: "MAIZ" | "TRIGO" | "CEBADA" | undefined;
    }, {
        nombre: string;
        capacidad: number;
        cultivo?: "MAIZ" | "TRIGO" | "CEBADA" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        nombre: string;
        capacidad: number;
        cultivo?: "MAIZ" | "TRIGO" | "CEBADA" | undefined;
    };
}, {
    body: {
        nombre: string;
        capacidad: number;
        cultivo?: "MAIZ" | "TRIGO" | "CEBADA" | undefined;
    };
}>;
export declare const updateSiloSchema: z.ZodObject<{
    body: z.ZodObject<{
        nombre: z.ZodOptional<z.ZodString>;
        capacidad: z.ZodOptional<z.ZodNumber>;
        cultivo: z.ZodOptional<z.ZodEnum<["MAIZ", "TRIGO", "CEBADA"]>>;
    }, "strip", z.ZodTypeAny, {
        nombre?: string | undefined;
        cultivo?: "MAIZ" | "TRIGO" | "CEBADA" | undefined;
        capacidad?: number | undefined;
    }, {
        nombre?: string | undefined;
        cultivo?: "MAIZ" | "TRIGO" | "CEBADA" | undefined;
        capacidad?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        nombre?: string | undefined;
        cultivo?: "MAIZ" | "TRIGO" | "CEBADA" | undefined;
        capacidad?: number | undefined;
    };
}, {
    body: {
        nombre?: string | undefined;
        cultivo?: "MAIZ" | "TRIGO" | "CEBADA" | undefined;
        capacidad?: number | undefined;
    };
}>;
export declare const createLiquidacionSchema: z.ZodObject<{
    body: z.ZodObject<{
        socioId: z.ZodString;
        cosechaId: z.ZodOptional<z.ZodString>;
        totalKilos: z.ZodNumber;
        precioBase: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        socioId: string;
        totalKilos: number;
        precioBase: number;
        cosechaId?: string | undefined;
    }, {
        socioId: string;
        totalKilos: number;
        precioBase: number;
        cosechaId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        socioId: string;
        totalKilos: number;
        precioBase: number;
        cosechaId?: string | undefined;
    };
}, {
    body: {
        socioId: string;
        totalKilos: number;
        precioBase: number;
        cosechaId?: string | undefined;
    };
}>;
export declare const calcularLiquidacionSchema: z.ZodObject<{
    body: z.ZodObject<{
        socioId: z.ZodString;
        cosechaId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        socioId: string;
        cosechaId?: string | undefined;
    }, {
        socioId: string;
        cosechaId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        socioId: string;
        cosechaId?: string | undefined;
    };
}, {
    body: {
        socioId: string;
        cosechaId?: string | undefined;
    };
}>;
export declare const createCampanaSchema: z.ZodObject<{
    body: z.ZodObject<{
        nombre: z.ZodString;
        precioBaseMaiz: z.ZodNumber;
        precioBaseTrigo: z.ZodNumber;
        porcentajeApoyo: z.ZodNumber;
        fechaInicio: z.ZodString;
        fechaFin: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        nombre: string;
        precioBaseMaiz: number;
        precioBaseTrigo: number;
        porcentajeApoyo: number;
        fechaInicio: string;
        fechaFin: string;
    }, {
        nombre: string;
        precioBaseMaiz: number;
        precioBaseTrigo: number;
        porcentajeApoyo: number;
        fechaInicio: string;
        fechaFin: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        nombre: string;
        precioBaseMaiz: number;
        precioBaseTrigo: number;
        porcentajeApoyo: number;
        fechaInicio: string;
        fechaFin: string;
    };
}, {
    body: {
        nombre: string;
        precioBaseMaiz: number;
        precioBaseTrigo: number;
        porcentajeApoyo: number;
        fechaInicio: string;
        fechaFin: string;
    };
}>;
export declare const paginationSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
        limit: z.ZodDefault<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
        search: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        search?: string | undefined;
    }, {
        search?: string | undefined;
        page?: string | undefined;
        limit?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        page: number;
        limit: number;
        search?: string | undefined;
    };
}, {
    query: {
        search?: string | undefined;
        page?: string | undefined;
        limit?: string | undefined;
    };
}>;
//# sourceMappingURL=schemas.d.ts.map