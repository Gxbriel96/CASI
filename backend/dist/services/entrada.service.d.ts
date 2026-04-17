export declare class EntradaService {
    findAll(page?: number, limit?: number, socioId?: string, siloId?: string): Promise<{
        entradas: ({
            socio: {
                id: string;
                nombre: string;
                numeroSocio: string;
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
    }>;
    create(data: {
        socioId: string;
        cosechaId?: string;
        siloId?: string;
        peso: number;
        humedad: number;
        pesoEspecifico: number;
        temperatura: number;
        impurezas: number;
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
    }>;
    update(id: string, data: {
        siloId?: string;
        peso?: number;
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
    }>;
    delete(id: string): Promise<void>;
}
export declare const entradaService: EntradaService;
//# sourceMappingURL=entrada.service.d.ts.map