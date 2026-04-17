"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.liquidacionService = exports.LiquidacionService = void 0;
const database_1 = __importDefault(require("../config/database"));
const errors_1 = require("../utils/errors");
class LiquidacionService {
    async findAll(page = 1, limit = 10, socioId) {
        const where = socioId ? { socioId } : {};
        const [liquidaciones, total] = await Promise.all([
            database_1.default.liquidacion.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { fechaLiquidacion: "desc" },
                include: {
                    socio: { select: { id: true, numeroSocio: true, nombre: true } },
                    cosecha: true,
                },
            }),
            database_1.default.liquidacion.count({ where }),
        ]);
        return { liquidaciones, total, page, limit };
    }
    async findById(id) {
        const liquidacion = await database_1.default.liquidacion.findUnique({
            where: { id },
            include: {
                socio: true,
                cosecha: { include: { parcela: true } },
            },
        });
        if (!liquidacion) {
            throw new errors_1.NotFoundError("Liquidación no encontrada");
        }
        return liquidacion;
    }
    async findBySocio(socioId, page = 1, limit = 10) {
        const [liquidaciones, total] = await Promise.all([
            database_1.default.liquidacion.findMany({
                where: { socioId },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { fechaLiquidacion: "desc" },
                include: { cosecha: true },
            }),
            database_1.default.liquidacion.count({ where: { socioId } }),
        ]);
        return { liquidaciones, total, page, limit };
    }
    async create(data) {
        const socio = await database_1.default.socio.findUnique({ where: { id: data.socioId } });
        if (!socio)
            throw new errors_1.NotFoundError("Socio no encontrado");
        const importeBruto = data.totalKilos * data.precioBase;
        const apoyoGobierno = data.porcentajeApoyo
            ? importeBruto * (data.porcentajeApoyo / 100)
            : 0;
        const importeTotal = importeBruto + apoyoGobierno;
        const liquidacion = await database_1.default.liquidacion.create({
            data: {
                socioId: data.socioId,
                cosechaId: data.cosechaId,
                totalKilos: data.totalKilos,
                precioBase: data.precioBase,
                importeBruto,
                apoyoGobierno,
                importeTotal,
            },
            include: { socio: true },
        });
        return liquidacion;
    }
    async calcular(socioId, cosechaId) {
        const socio = await database_1.default.socio.findUnique({ where: { id: socioId } });
        if (!socio)
            throw new errors_1.NotFoundError("Socio no encontrado");
        const campana = await database_1.default.campana.findFirst({
            where: { activa: true },
            orderBy: { fechaInicio: "desc" },
        });
        if (!campana) {
            throw new errors_1.ValidationError("No hay campaña activa configurada");
        }
        const where = { socioId };
        if (cosechaId)
            where.cosechaId = cosechaId;
        const entradas = await database_1.default.entradaAlmacen.findMany({
            where,
            include: {
                cosecha: true,
                controlCalidad: { where: { resultado: "APROBADO" } },
            },
        });
        if (entradas.length === 0) {
            throw new errors_1.ValidationError("No hay entradas aprobadas para liquidar");
        }
        const totalKilos = entradas.reduce((acc, e) => acc + e.peso, 0);
        const cultivo = entradas[0].cosecha?.cultivo;
        const precioBase = cultivo === "TRIGO" ? campana.precioBaseTrigo : campana.precioBaseMaiz;
        const importeBruto = totalKilos * precioBase;
        const apoyoGobierno = importeBruto * (campana.porcentajeApoyo / 100);
        const importeTotal = importeBruto + apoyoGobierno;
        return {
            socio: { id: socio.id, numeroSocio: socio.numeroSocio, nombre: socio.nombre },
            totalEntradas: entradas.length,
            totalKilos: parseFloat(totalKilos.toFixed(2)),
            cultivo,
            precioBase,
            importeBruto: parseFloat(importeBruto.toFixed(2)),
            apoyoGobierno: parseFloat(apoyoGobierno.toFixed(2)),
            importeTotal: parseFloat(importeTotal.toFixed(2)),
            porcentajeApoyo: campana.porcentajeApoyo,
        };
    }
    async delete(id) {
        await database_1.default.liquidacion.delete({ where: { id } });
    }
    async getEstadisticas() {
        const [aggregated, porSocio, porMes] = await Promise.all([
            database_1.default.liquidacion.aggregate({
                _sum: { importeTotal: true, totalKilos: true, apoyoGobierno: true },
                _count: true,
            }),
            database_1.default.liquidacion.groupBy({
                by: ["socioId"],
                _sum: { importeTotal: true, totalKilos: true },
                _count: true,
                orderBy: { _sum: { importeTotal: "desc" } },
                take: 10,
            }),
            database_1.default.$queryRaw `
        SELECT DATE_TRUNC('month', fechaLiquidacion) as mes,
               SUM(importeTotal) as total, SUM(totalKilos) as kilos
        FROM "Liquidacion"
        GROUP BY DATE_TRUNC('month', fechaLiquidacion)
        ORDER BY mes DESC
        LIMIT 12
      `,
        ]);
        return {
            totalLiquidaciones: aggregated._count,
            importeTotal: aggregated._sum.importeTotal || 0,
            totalKilos: aggregated._sum.totalKilos || 0,
            apoyoGobierno: aggregated._sum.apoyoGobierno || 0,
            topSocios: porSocio.map((s) => ({
                socioId: s.socioId,
                importeTotal: s._sum.importeTotal || 0,
                totalKilos: s._sum.totalKilos || 0,
            })),
            porMes,
        };
    }
}
exports.LiquidacionService = LiquidacionService;
exports.liquidacionService = new LiquidacionService();
//# sourceMappingURL=liquidacion.service.js.map