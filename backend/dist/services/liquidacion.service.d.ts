export declare class LiquidacionService {
    findAll(page?: number, limit?: number, socioId?: string): Promise<{
        liquidaciones: ({
            socio: {
                id: string;
                nombre: string;
                numeroSocio: string;
            };
            cosecha: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                parcelaId: string;
                cultivo: import(".prisma/client").$Enums.TipoCultivo;
                rendimiento: number | null;
                fechaSiembra: Date | null;
                fechaCosecha: Date | null;
            } | null;
        } & {
            id: string;
            socioId: string;
            createdAt: Date;
            updatedAt: Date;
            cosechaId: string | null;
            totalKilos: number;
            precioBase: number;
            importeBruto: number;
            apoyoGobierno: number;
            importeTotal: number;
            fechaLiquidacion: Date;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: string): Promise<{
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
        cosecha: ({
            parcela: {
                id: string;
                nombre: string;
                socioId: string;
                createdAt: Date;
                updatedAt: Date;
                hectareas: number;
                ubicacion: string | null;
                coordenadas: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parcelaId: string;
            cultivo: import(".prisma/client").$Enums.TipoCultivo;
            rendimiento: number | null;
            fechaSiembra: Date | null;
            fechaCosecha: Date | null;
        }) | null;
    } & {
        id: string;
        socioId: string;
        createdAt: Date;
        updatedAt: Date;
        cosechaId: string | null;
        totalKilos: number;
        precioBase: number;
        importeBruto: number;
        apoyoGobierno: number;
        importeTotal: number;
        fechaLiquidacion: Date;
    }>;
    findBySocio(socioId: string, page?: number, limit?: number): Promise<{
        liquidaciones: ({
            cosecha: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                parcelaId: string;
                cultivo: import(".prisma/client").$Enums.TipoCultivo;
                rendimiento: number | null;
                fechaSiembra: Date | null;
                fechaCosecha: Date | null;
            } | null;
        } & {
            id: string;
            socioId: string;
            createdAt: Date;
            updatedAt: Date;
            cosechaId: string | null;
            totalKilos: number;
            precioBase: number;
            importeBruto: number;
            apoyoGobierno: number;
            importeTotal: number;
            fechaLiquidacion: Date;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(data: {
        socioId: string;
        cosechaId?: string;
        totalKilos: number;
        precioBase: number;
        porcentajeApoyo?: number;
    }): Promise<{
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
        totalKilos: number;
        precioBase: number;
        importeBruto: number;
        apoyoGobierno: number;
        importeTotal: number;
        fechaLiquidacion: Date;
    }>;
    calcular(socioId: string, cosechaId?: string): Promise<{
        socio: {
            id: string;
            numeroSocio: string;
            nombre: string;
        };
        totalEntradas: number;
        totalKilos: number;
        cultivo: import(".prisma/client").$Enums.TipoCultivo | undefined;
        precioBase: number;
        importeBruto: number;
        apoyoGobierno: number;
        importeTotal: number;
        porcentajeApoyo: number;
    }>;
    delete(id: string): Promise<void>;
    getEstadisticas(): Promise<{
        totalLiquidaciones: number;
        importeTotal: number;
        totalKilos: number;
        apoyoGobierno: number;
        topSocios: {
            socioId: string;
            importeTotal: number;
            totalKilos: number;
        }[];
        porMes: unknown;
    }>;
}
export declare const liquidacionService: LiquidacionService;
//# sourceMappingURL=liquidacion.service.d.ts.map