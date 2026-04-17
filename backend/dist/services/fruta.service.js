"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.frutaService = exports.FrutaService = void 0;
const database_1 = __importDefault(require("../config/database"));
const errors_1 = require("../utils/errors");
class FrutaService {
    async findAll(page = 1, limit = 10, socioId, especie) {
        const where = {};
        if (socioId)
            where.socioId = socioId;
        if (especie)
            where.especie = especie;
        const [frutas, total] = await Promise.all([
            database_1.default.frutaControl.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    socio: { select: { id: true, numeroSocio: true, nombre: true } },
                },
            }),
            database_1.default.frutaControl.count({ where }),
        ]);
        return { frutas, total, page, limit };
    }
    async findById(id) {
        const fruta = await database_1.default.frutaControl.findUnique({
            where: { id },
            include: { socio: true },
        });
        if (!fruta) {
            throw new errors_1.NotFoundError("Control de fruta no encontrado");
        }
        return fruta;
    }
    async create(data) {
        const socio = await database_1.default.socio.findUnique({ where: { id: data.socioId } });
        if (!socio)
            throw new errors_1.NotFoundError("Socio no encontrado");
        const fruta = await database_1.default.frutaControl.create({
            data,
            include: { socio: true },
        });
        return fruta;
    }
    async delete(id) {
        await database_1.default.frutaControl.delete({ where: { id } });
    }
    async getEstadisticas(socioId) {
        const where = socioId ? { socioId } : {};
        const [total, porEspecie, porCalibre, promedioAzucar, promedioDureza] = await Promise.all([
            database_1.default.frutaControl.count({ where }),
            database_1.default.frutaControl.groupBy({
                by: ["especie"],
                where,
                _count: true,
            }),
            database_1.default.frutaControl.groupBy({
                by: ["calibre"],
                where,
                _count: true,
            }),
            database_1.default.frutaControl.aggregate({
                where,
                _avg: { azucar: true },
            }),
            database_1.default.frutaControl.aggregate({
                where,
                _avg: { dureza: true },
            }),
        ]);
        return {
            total,
            porEspecie: porEspecie.map((e) => ({ especie: e.especie, count: e._count })),
            porCalibre: porCalibre.map((c) => ({ calibre: c.calibre, count: c._count })),
            promedioAzucar: promedioAzucar._avg.azucar || 0,
            promedioDureza: promedioDureza._avg.dureza || 0,
        };
    }
}
exports.FrutaService = FrutaService;
exports.frutaService = new FrutaService();
//# sourceMappingURL=fruta.service.js.map