export declare class SocioService {
    findAll(page?: number, limit?: number, search?: string): Promise<{
        socios: ({
            parcelas: {
                id: string;
                nombre: string;
                socioId: string;
                createdAt: Date;
                updatedAt: Date;
                hectareas: number;
                ubicacion: string | null;
                coordenadas: string | null;
            }[];
            _count: {
                parcelas: number;
                entradas: number;
                liquidaciones: number;
            };
        } & {
            id: string;
            email: string | null;
            nombre: string;
            createdAt: Date;
            updatedAt: Date;
            numeroSocio: string;
            telefono: string | null;
            direccion: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: string): Promise<{
        usuario: {
            id: string;
            email: string;
            rol: import(".prisma/client").$Enums.Rol;
        } | null;
        parcelas: ({
            cosechas: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                parcelaId: string;
                cultivo: import(".prisma/client").$Enums.TipoCultivo;
                rendimiento: number | null;
                fechaSiembra: Date | null;
                fechaCosecha: Date | null;
            }[];
        } & {
            id: string;
            nombre: string;
            socioId: string;
            createdAt: Date;
            updatedAt: Date;
            hectareas: number;
            ubicacion: string | null;
            coordenadas: string | null;
        })[];
    } & {
        id: string;
        email: string | null;
        nombre: string;
        createdAt: Date;
        updatedAt: Date;
        numeroSocio: string;
        telefono: string | null;
        direccion: string | null;
    }>;
    create(data: {
        nombre: string;
        telefono?: string;
        email?: string;
        direccion?: string;
    }): Promise<{
        id: string;
        email: string | null;
        nombre: string;
        createdAt: Date;
        updatedAt: Date;
        numeroSocio: string;
        telefono: string | null;
        direccion: string | null;
    }>;
    update(id: string, data: {
        nombre?: string;
        telefono?: string;
        email?: string;
        direccion?: string;
    }): Promise<{
        id: string;
        email: string | null;
        nombre: string;
        createdAt: Date;
        updatedAt: Date;
        numeroSocio: string;
        telefono: string | null;
        direccion: string | null;
    }>;
    delete(id: string): Promise<void>;
    getParcelas(socioId: string): Promise<({
        cosechas: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            parcelaId: string;
            cultivo: import(".prisma/client").$Enums.TipoCultivo;
            rendimiento: number | null;
            fechaSiembra: Date | null;
            fechaCosecha: Date | null;
        }[];
    } & {
        id: string;
        nombre: string;
        socioId: string;
        createdAt: Date;
        updatedAt: Date;
        hectareas: number;
        ubicacion: string | null;
        coordenadas: string | null;
    })[]>;
    getEntradas(socioId: string, page?: number, limit?: number): Promise<{
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
        total: number;
        page: number;
        limit: number;
    }>;
    getLiquidaciones(socioId: string, page?: number, limit?: number): Promise<{
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
}
export declare const socioService: SocioService;
//# sourceMappingURL=socio.service.d.ts.map