export declare class SiloService {
    findAll(): Promise<{
        porcentajeOcupacion: number;
        _count: {
            entradas: number;
        };
        id: string;
        nombre: string;
        createdAt: Date;
        updatedAt: Date;
        cultivo: import(".prisma/client").$Enums.TipoCultivo | null;
        capacidad: number;
        stockActual: number;
    }[]>;
    findById(id: string): Promise<{
        porcentajeOcupacion: number;
        entradas: ({
            socio: {
                nombre: string;
                numeroSocio: string;
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
        })[];
        id: string;
        nombre: string;
        createdAt: Date;
        updatedAt: Date;
        cultivo: import(".prisma/client").$Enums.TipoCultivo | null;
        capacidad: number;
        stockActual: number;
    }>;
    create(data: {
        nombre: string;
        capacidad: number;
        cultivo?: "MAIZ" | "TRIGO" | "CEBADA";
    }): Promise<{
        id: string;
        nombre: string;
        createdAt: Date;
        updatedAt: Date;
        cultivo: import(".prisma/client").$Enums.TipoCultivo | null;
        capacidad: number;
        stockActual: number;
    }>;
    update(id: string, data: {
        nombre?: string;
        capacidad?: number;
        cultivo?: "MAIZ" | "TRIGO" | "CEBADA";
    }): Promise<{
        id: string;
        nombre: string;
        createdAt: Date;
        updatedAt: Date;
        cultivo: import(".prisma/client").$Enums.TipoCultivo | null;
        capacidad: number;
        stockActual: number;
    }>;
    delete(id: string): Promise<void>;
    updateStock(id: string, cantidad: number, operacion: "agregar" | "quitar"): Promise<{
        id: string;
        nombre: string;
        createdAt: Date;
        updatedAt: Date;
        cultivo: import(".prisma/client").$Enums.TipoCultivo | null;
        capacidad: number;
        stockActual: number;
    }>;
    getResumenOcupacion(): Promise<{
        totalSilos: number;
        totalCapacidad: number;
        totalStock: number;
        promedioOcupacion: number;
        silos: {
            id: string;
            nombre: string;
            capacidad: number;
            stock: number;
            cultivo: import(".prisma/client").$Enums.TipoCultivo | null;
            ocupacion: number;
        }[];
    }>;
}
export declare const siloService: SiloService;
//# sourceMappingURL=silo.service.d.ts.map