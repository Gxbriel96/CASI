export declare class ParcelaService {
    findAll(socioId?: string): Promise<({
        socio: {
            id: string;
            nombre: string;
            numeroSocio: string;
        };
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
    }>;
    create(data: {
        socioId: string;
        nombre: string;
        hectareas: number;
        ubicacion?: string;
        coordenadas?: string;
    }): Promise<{
        id: string;
        nombre: string;
        socioId: string;
        createdAt: Date;
        updatedAt: Date;
        hectareas: number;
        ubicacion: string | null;
        coordenadas: string | null;
    }>;
    update(id: string, data: {
        nombre?: string;
        hectareas?: number;
        ubicacion?: string;
        coordenadas?: string;
    }): Promise<{
        id: string;
        nombre: string;
        socioId: string;
        createdAt: Date;
        updatedAt: Date;
        hectareas: number;
        ubicacion: string | null;
        coordenadas: string | null;
    }>;
    delete(id: string): Promise<void>;
    getTrazabilidad(id: string): Promise<{
        parcela: {
            id: string;
            nombre: string;
            hectareas: number;
            ubicacion: string | null;
            coordenadas: string | null;
        };
        socio: {
            id: string;
            numeroSocio: string;
            nombre: string;
        };
        historial: {
            cosecha: {
                id: string;
                cultivo: import(".prisma/client").$Enums.TipoCultivo;
                rendimiento: number | null;
                fechaSiembra: Date | null;
                fechaCosecha: Date | null;
            };
            entradas: {
                id: string;
                fecha: Date;
                peso: number;
                humedad: number;
                pesoEspecifico: number;
                temperatura: number;
                impurezas: number;
                resultadoCalidad: import(".prisma/client").$Enums.ResultadoCalidad | undefined;
                silo: string | undefined;
            }[];
        }[];
    }>;
}
export declare const parcelaService: ParcelaService;
//# sourceMappingURL=parcela.service.d.ts.map