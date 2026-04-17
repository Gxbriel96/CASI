"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socioService = exports.SocioService = void 0;
const database_1 = __importDefault(require("../config/database"));
const errors_1 = require("../utils/errors");
class SocioService {
    async findAll(page = 1, limit = 10, search) {
        const where = search
            ? {
                OR: [
                    { nombre: { contains: search, mode: "insensitive" } },
                    { numeroSocio: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ],
            }
            : {};
        const [socios, total] = await Promise.all([
            database_1.default.socio.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    parcelas: true,
                    _count: { select: { parcelas: true, entradas: true, liquidaciones: true } },
                },
            }),
            database_1.default.socio.count({ where }),
        ]);
        return { socios, total, page, limit };
    }
    async findById(id) {
        const socio = await database_1.default.socio.findUnique({
            where: { id },
            include: {
                parcelas: { include: { cosechas: true } },
                usuario: { select: { id: true, email: true, rol: true } },
            },
        });
        if (!socio) {
            throw new errors_1.NotFoundError("Socio no encontrado");
        }
        return socio;
    }
    async create(data) {
        const lastSocio = await database_1.default.socio.findFirst({
            orderBy: { numeroSocio: "desc" },
        });
        const nextNumber = lastSocio
            ? parseInt(lastSocio.numeroSocio) + 1
            : 1;
        const numeroSocio = nextNumber.toString().padStart(4, "0");
        const socio = await database_1.default.socio.create({
            data: {
                numeroSocio,
                ...data,
            },
        });
        return socio;
    }
    async update(id, data) {
        const socio = await database_1.default.socio.update({
            where: { id },
            data,
        });
        return socio;
    }
    async delete(id) {
        const entradas = await database_1.default.entradaAlmacen.count({ where: { socioId: id } });
        const liquidaciones = await database_1.default.liquidacion.count({ where: { socioId: id } });
        if (entradas > 0 || liquidaciones > 0) {
            throw new errors_1.ValidationError("No se puede eliminar un socio con entradas o liquidaciones asociadas");
        }
        await database_1.default.socio.delete({ where: { id } });
    }
    async getParcelas(socioId) {
        const parcelas = await database_1.default.parcela.findMany({
            where: { socioId },
            include: { cosechas: true },
        });
        return parcelas;
    }
    async getEntradas(socioId, page = 1, limit = 10) {
        const [entradas, total] = await Promise.all([
            database_1.default.entradaAlmacen.findMany({
                where: { socioId },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: { controlCalidad: true, silo: true },
            }),
            database_1.default.entradaAlmacen.count({ where: { socioId } }),
        ]);
        return { entradas, total, page, limit };
    }
    async getLiquidaciones(socioId, page = 1, limit = 10) {
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
}
exports.SocioService = SocioService;
exports.socioService = new SocioService();
//# sourceMappingURL=socio.service.js.map