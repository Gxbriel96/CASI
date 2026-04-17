export declare class CampanaService {
    findAll(): Promise<{
        id: string;
        nombre: string;
        createdAt: Date;
        updatedAt: Date;
        precioBaseMaiz: number;
        precioBaseTrigo: number;
        porcentajeApoyo: number;
        fechaInicio: Date;
        fechaFin: Date;
        activa: boolean;
    }[]>;
    findActive(): Promise<{
        id: string;
        nombre: string;
        createdAt: Date;
        updatedAt: Date;
        precioBaseMaiz: number;
        precioBaseTrigo: number;
        porcentajeApoyo: number;
        fechaInicio: Date;
        fechaFin: Date;
        activa: boolean;
    } | null>;
    findById(id: string): Promise<{
        id: string;
        nombre: string;
        createdAt: Date;
        updatedAt: Date;
        precioBaseMaiz: number;
        precioBaseTrigo: number;
        porcentajeApoyo: number;
        fechaInicio: Date;
        fechaFin: Date;
        activa: boolean;
    }>;
    create(data: {
        nombre: string;
        precioBaseMaiz: number;
        precioBaseTrigo: number;
        porcentajeApoyo: number;
        fechaInicio: Date;
        fechaFin: Date;
    }): Promise<{
        id: string;
        nombre: string;
        createdAt: Date;
        updatedAt: Date;
        precioBaseMaiz: number;
        precioBaseTrigo: number;
        porcentajeApoyo: number;
        fechaInicio: Date;
        fechaFin: Date;
        activa: boolean;
    }>;
    update(id: string, data: {
        nombre?: string;
        precioBaseMaiz?: number;
        precioBaseTrigo?: number;
        porcentajeApoyo?: number;
        fechaInicio?: Date;
        fechaFin?: Date;
        activa?: boolean;
    }): Promise<{
        id: string;
        nombre: string;
        createdAt: Date;
        updatedAt: Date;
        precioBaseMaiz: number;
        precioBaseTrigo: number;
        porcentajeApoyo: number;
        fechaInicio: Date;
        fechaFin: Date;
        activa: boolean;
    }>;
    delete(id: string): Promise<void>;
}
export declare const campanaService: CampanaService;
//# sourceMappingURL=campana.service.d.ts.map