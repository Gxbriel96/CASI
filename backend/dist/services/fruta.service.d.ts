export declare class FrutaService {
    findAll(page?: number, limit?: number, socioId?: string, especie?: string): Promise<{
        frutas: ({
            socio: {
                id: string;
                nombre: string;
                numeroSocio: string;
            };
        } & {
            id: string;
            socioId: string;
            createdAt: Date;
            updatedAt: Date;
            usuarioId: string;
            especie: import(".prisma/client").$Enums.EspecieFruta;
            variedad: string | null;
            calibre: import(".prisma/client").$Enums.Calibre;
            azucar: number;
            dureza: number;
            defectos: number;
            observaciones: string | null;
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
    } & {
        id: string;
        socioId: string;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string;
        especie: import(".prisma/client").$Enums.EspecieFruta;
        variedad: string | null;
        calibre: import(".prisma/client").$Enums.Calibre;
        azucar: number;
        dureza: number;
        defectos: number;
        observaciones: string | null;
    }>;
    create(data: {
        socioId: string;
        especie: "MELOCOTON" | "NECTARINA" | "ALBARICOQUE" | "CIRUELA";
        variedad?: string;
        calibre: "AA" | "A" | "B" | "C";
        azucar: number;
        dureza: number;
        defectos: number;
        observaciones?: string;
        usuarioId: string;
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
        usuarioId: string;
        especie: import(".prisma/client").$Enums.EspecieFruta;
        variedad: string | null;
        calibre: import(".prisma/client").$Enums.Calibre;
        azucar: number;
        dureza: number;
        defectos: number;
        observaciones: string | null;
    }>;
    delete(id: string): Promise<void>;
    getEstadisticas(socioId?: string): Promise<{
        total: number;
        porEspecie: {
            especie: import(".prisma/client").$Enums.EspecieFruta;
            count: number;
        }[];
        porCalibre: {
            calibre: import(".prisma/client").$Enums.Calibre;
            count: number;
        }[];
        promedioAzucar: number;
        promedioDureza: number;
    }>;
}
export declare const frutaService: FrutaService;
//# sourceMappingURL=fruta.service.d.ts.map