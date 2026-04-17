"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = exports.DashboardService = void 0;
const database_1 = __importDefault(require("../config/database"));
class DashboardService {
    async getMetricas() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [totalSocios, totalParcelas, hoyEntradas, totalEntradasMes, totalLiquidaciones, importeTotalLiquidado, ultimaCampana,] = await Promise.all([
            database_1.default.socio.count(),
            database_1.default.parcela.count(),
            database_1.default.entradaAlmacen.count({ where: { createdAt: { gte: today } } }),
            database_1.default.entradaAlmacen.count({
                where: {
                    createdAt: {
                        gte: new Date(today.getFullYear(), today.getMonth(), 1),
                    },
                },
            }),
            database_1.default.liquidacion.count(),
            database_1.default.liquidacion.aggregate({ _sum: { importeTotal: true } }),
            database_1.default.campana.findFirst({ where: { activa: true }, orderBy: { fechaInicio: "desc" } }),
        ]);
        const rendimientoPorHectarea = await database_1.default.cosecha.findMany({
            where: { rendimiento: { not: null } },
            include: { parcela: true },
        });
        const rendimientoPromedio = rendimientoPorHectarea.length > 0
            ? rendimientoPorHectarea.reduce((acc, c) => acc + (c.rendimiento || 0), 0) / rendimientoPorHectarea.length
            : 0;
        return {
            totalSocios,
            totalParcelas,
            hoyEntradas,
            totalEntradasMes,
            totalLiquidaciones,
            importeTotalLiquidado: importeTotalLiquidado._sum.importeTotal || 0,
            rendimientoPromedioHectarea: parseFloat(rendimientoPromedio.toFixed(2)),
            campanaActiva: ultimaCampana
                ? {
                    id: ultimaCampana.id,
                    nombre: ultimaCampana.nombre,
                    precioBaseMaiz: ultimaCampana.precioBaseMaiz,
                    precioBaseTrigo: ultimaCampana.precioBaseTrigo,
                    porcentajeApoyo: ultimaCampana.porcentajeApoyo,
                }
                : null,
        };
    }
    async getOcupacionSilos() {
        const silos = await database_1.default.silo.findMany();
        const totalCapacidad = silos.reduce((acc, s) => acc + s.capacidad, 0);
        const totalStock = silos.reduce((acc, s) => acc + s.stockActual, 0);
        return {
            totalSilos: silos.length,
            totalCapacidad,
            totalStock,
            porcentajeOcupacion: totalCapacidad > 0 ? parseFloat(((totalStock / totalCapacidad) * 100).toFixed(2)) : 0,
            silos: silos.map((s) => ({
                id: s.id,
                nombre: s.nombre,
                capacidad: s.capacidad,
                stock: s.stockActual,
                cultivo: s.cultivo,
                ocupacion: parseFloat(((s.stockActual / s.capacidad) * 100).toFixed(2)),
            })),
        };
    }
    async getEntradasPorCultivo() {
        const entradas = await database_1.default.entradaAlmacen.findMany({
            include: { cosecha: true },
        });
        const porCultivo = entradas.reduce((acc, e) => {
            const cultivo = e.cosecha?.cultivo || "SIN_CAMPAÑA";
            if (!acc[cultivo]) {
                acc[cultivo] = { cantidad: 0, peso: 0 };
            }
            acc[cultivo].cantidad += 1;
            acc[cultivo].peso += e.peso;
            return acc;
        }, {});
        return Object.entries(porCultivo).map(([cultivo, data]) => ({
            cultivo,
            cantidad: data.cantidad,
            peso: parseFloat(data.peso.toFixed(2)),
        }));
    }
    async getTopSocios(limit = 10) {
        const top = await database_1.default.liquidacion.groupBy({
            by: ["socioId"],
            _sum: { importeTotal: true, totalKilos: true },
            orderBy: { _sum: { importeTotal: "desc" } },
            take: limit,
        });
        const socios = await database_1.default.socio.findMany({
            where: { id: { in: top.map((t) => t.socioId) } },
        });
        const socioMap = new Map(socios.map((s) => [s.id, s]));
        return top.map((t) => ({
            socio: socioMap.get(t.socioId),
            totalKilos: t._sum.totalKilos || 0,
            importeTotal: t._sum.importeTotal || 0,
        }));
    }
}
exports.DashboardService = DashboardService;
exports.dashboardService = new DashboardService();
//# sourceMappingURL=dashboard.service.js.map