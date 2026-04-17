export declare class ControlCalidadService {
    findAll(page?: number, limit?: number, resultado?: string): Promise<{
        controles: ({
            entrada: {
                socio: {
                    id: string;
                    email: string | null;
                    nombre: string;
                    createdAt: Date;
                    updatedAt: Date;
                    numeroSocio: string;
                    telefono: string | null;
                    direccion: string | null;
                };
                silo: {
                    id: string;
                    nombre: string;
                    createdAt: Date;
                    updatedAt: Date;
                    cultivo: import(".prisma/client").$Enums.TipoCultivo | null;
                    capacidad: number;
                    stockActual: number;
                } | null;
            } & {
                id: string;
                socioId: string;
                createdAt: Date;
                updatedAt: Date;
                cosechaId: string | null;
                siloId: string | null;
                peso: number;
                humedad: number;
                pesoEspecifico: number;
                temperatura: number;
                impurezas: number;
                usuarioId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            humedad: number;
            pesoEspecifico: number;
            temperatura: number;
            impurezas: number;
            observaciones: string | null;
            entradaAlmacenId: string;
            resultado: import(".prisma/client").$Enums.ResultadoCalidad;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: string): Promise<{
        entrada: {
            socio: {
                id: string;
                email: string | null;
                nombre: string;
                createdAt: Date;
                updatedAt: Date;
                numeroSocio: string;
                telefono: string | null;
                direccion: string | null;
            };
            silo: {
                id: string;
                nombre: string;
                createdAt: Date;
                updatedAt: Date;
                cultivo: import(".prisma/client").$Enums.TipoCultivo | null;
                capacidad: number;
                stockActual: number;
            } | null;
        } & {
            id: string;
            socioId: string;
            createdAt: Date;
            updatedAt: Date;
            cosechaId: string | null;
            siloId: string | null;
            peso: number;
            humedad: number;
            pesoEspecifico: number;
            temperatura: number;
            impurezas: number;
            usuarioId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        humedad: number;
        pesoEspecifico: number;
        temperatura: number;
        impurezas: number;
        observaciones: string | null;
        entradaAlmacenId: string;
        resultado: import(".prisma/client").$Enums.ResultadoCalidad;
    }>;
    create(data: {
        entradaAlmacenId: string;
        humedad: number;
        pesoEspecifico: number;
        temperatura: number;
        impurezas: number;
        observaciones?: string;
    }): Promise<{
        entrada: {
            socio: {
                id: string;
                email: string | null;
                nombre: string;
                createdAt: Date;
                updatedAt: Date;
                numeroSocio: string;
                telefono: string | null;
                direccion: string | null;
            };
        } & {
            id: string;
            socioId: string;
            createdAt: Date;
            updatedAt: Date;
            cosechaId: string | null;
            siloId: string | null;
            peso: number;
            humedad: number;
            pesoEspecifico: number;
            temperatura: number;
            impurezas: number;
            usuarioId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        humedad: number;
        pesoEspecifico: number;
        temperatura: number;
        impurezas: number;
        observaciones: string | null;
        entradaAlmacenId: string;
        resultado: import(".prisma/client").$Enums.ResultadoCalidad;
    }>;
    updateResultado(id: string, resultado: "APROBADO" | "RECHAZADO", observaciones?: string): Promise<{
        entrada: {
            socio: {
                id: string;
                email: string | null;
                nombre: string;
                createdAt: Date;
                updatedAt: Date;
                numeroSocio: string;
                telefono: string | null;
                direccion: string | null;
            };
        } & {
            id: string;
            socioId: string;
            createdAt: Date;
            updatedAt: Date;
            cosechaId: string | null;
            siloId: string | null;
            peso: number;
            humedad: number;
            pesoEspecifico: number;
            temperatura: number;
            impurezas: number;
            usuarioId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        humedad: number;
        pesoEspecifico: number;
        temperatura: number;
        impurezas: number;
        observaciones: string | null;
        entradaAlmacenId: string;
        resultado: import(".prisma/client").$Enums.ResultadoCalidad;
    }>;
}
export declare const controlCalidadService: ControlCalidadService;
//# sourceMappingURL=control-calidad.service.d.ts.map