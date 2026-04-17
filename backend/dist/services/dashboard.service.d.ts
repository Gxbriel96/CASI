export declare class DashboardService {
    getMetricas(): Promise<{
        totalSocios: number;
        totalParcelas: number;
        hoyEntradas: number;
        totalEntradasMes: number;
        totalLiquidaciones: number;
        importeTotalLiquidado: number;
        rendimientoPromedioHectarea: number;
        campanaActiva: {
            id: string;
            nombre: string;
            precioBaseMaiz: number;
            precioBaseTrigo: number;
            porcentajeApoyo: number;
        } | null;
    }>;
    getOcupacionSilos(): Promise<{
        totalSilos: number;
        totalCapacidad: number;
        totalStock: number;
        porcentajeOcupacion: number;
        silos: {
            id: string;
            nombre: string;
            capacidad: number;
            stock: number;
            cultivo: import(".prisma/client").$Enums.TipoCultivo | null;
            ocupacion: number;
        }[];
    }>;
    getEntradasPorCultivo(): Promise<{
        cultivo: string;
        cantidad: number;
        peso: number;
    }[]>;
    getTopSocios(limit?: number): Promise<{
        socio: {
            id: string;
            email: string | null;
            nombre: string;
            createdAt: Date;
            updatedAt: Date;
            numeroSocio: string;
            telefono: string | null;
            direccion: string | null;
        } | undefined;
        totalKilos: number;
        importeTotal: number;
    }[]>;
}
export declare const dashboardService: DashboardService;
//# sourceMappingURL=dashboard.service.d.ts.map