export declare class CosechaService {
    findAll(parcelaId?: string): Promise<({
        _count: {
            entradas: number;
            liquidaciones: number;
        };
        parcela: {
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
    })[]>;
    findById(id: string): Promise<{
        entradas: ({
            silo: {
                id: string;
                nombre: string;
                createdAt: Date;
                updatedAt: Date;
                cultivo: import(".prisma/client").$Enums.TipoCultivo | null;
                capacidad: number;
                stockActual: number;
            } | null;
            controlCalidad: {
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
        })[];
        liquidaciones: {
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
        }[];
        parcela: {
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
    }>;
    create(data: {
        parcelaId: string;
        cultivo: "MAIZ" | "TRIGO" | "CEBADA";
        rendimiento?: number;
        fechaSiembra?: Date;
        fechaCosecha?: Date;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parcelaId: string;
        cultivo: import(".prisma/client").$Enums.TipoCultivo;
        rendimiento: number | null;
        fechaSiembra: Date | null;
        fechaCosecha: Date | null;
    }>;
    update(id: string, data: {
        cultivo?: "MAIZ" | "TRIGO" | "CEBADA";
        rendimiento?: number;
        fechaSiembra?: Date;
        fechaCosecha?: Date;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parcelaId: string;
        cultivo: import(".prisma/client").$Enums.TipoCultivo;
        rendimiento: number | null;
        fechaSiembra: Date | null;
        fechaCosecha: Date | null;
    }>;
    delete(id: string): Promise<void>;
}
export declare const cosechaService: CosechaService;
//# sourceMappingURL=cosecha.service.d.ts.map