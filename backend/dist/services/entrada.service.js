"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.entradaService = exports.EntradaService = void 0;
const database_1 = __importDefault(require("../config/database"));
const errors_1 = require("../utils/errors");
class EntradaService {
    async findAll(page = 1, limit = 10, socioId, siloId) {
        const where = {};
        if (socioId)
            where.socioId = socioId;
        if (siloId)
            where.siloId = siloId;
        const [entradas, total] = await Promise.all([
            database_1.default.entradaAlmacen.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    socio: { select: { id: true, numeroSocio: true, nombre: true } },
                    silo: true,
                    controlCalidad: true,
                },
            }),
            database_1.default.entradaAlmacen.count({ where }),
        ]);
        return { entradas, total, page, limit };
    }
    async findById(id) {
        const entrada = await database_1.default.entradaAlmacen.findUnique({
            where: { id },
            include: {
                socio: true,
                cosecha: true,
                silo: true,
                controlCalidad: true,
            },
        });
        if (!entrada) {
            throw new errors_1.NotFoundError("Entrada no encontrada");
        }
        return entrada;
    }
    async create(data) {
        const socio = await database_1.default.socio.findUnique({ where: { id: data.socioId } });
        if (!socio)
            throw new errors_1.NotFoundError("Socio no encontrado");
        if (data.siloId) {
            const silo = await database_1.default.silo.findUnique({ where: { id: data.siloId } });
            if (!silo)
                throw new errors_1.NotFoundError("Silo no encontrado");
        }
        const entrada = await database_1.default.entradaAlmacen.create({
            data: {
                socioId: data.socioId,
                cosechaId: data.cosechaId,
                siloId: data.siloId,
                peso: data.peso,
                humedad: data.humedad,
                pesoEspecifico: data.pesoEspecifico,
                temperatura: data.temperatura,
                impurezas: data.impurezas,
                usuarioId: data.usuarioId,
            },
            include: {
                socio: true,
                silo: true,
            },
        });
        if (data.siloId) {
            const silo = await database_1.default.silo.findUnique({ where: { id: data.siloId } });
            if (silo) {
                await database_1.default.silo.update({
                    where: { id: data.siloId },
                    data: { stockActual: silo.stockActual + data.peso },
                });
            }
        }
        return entrada;
    }
    async update(id, data) {
        const entrada = await database_1.default.entradaAlmacen.findUnique({ where: { id } });
        if (!entrada)
            throw new errors_1.NotFoundError("Entrada no encontrada");
        if (data.siloId && data.siloId !== entrada.siloId) {
            const oldSilo = entrada.siloId ? await database_1.default.silo.findUnique({ where: { id: entrada.siloId } }) : null;
            if (oldSilo) {
                await database_1.default.silo.update({
                    where: { id: oldSilo.id },
                    data: { stockActual: oldSilo.stockActual - entrada.peso },
                });
            }
            const newSilo = await database_1.default.silo.findUnique({ where: { id: data.siloId } });
            if (!newSilo)
                throw new errors_1.NotFoundError("Silo no encontrado");
            await database_1.default.silo.update({
                where: { id: data.siloId },
                data: { stockActual: newSilo.stockActual + entrada.peso },
            });
        }
        const updated = await database_1.default.entradaAlmacen.update({
            where: { id },
            data,
            include: { socio: true, silo: true },
        });
        return updated;
    }
    async delete(id) {
        const entrada = await database_1.default.entradaAlmacen.findUnique({ where: { id } });
        if (!entrada)
            throw new errors_1.NotFoundError("Entrada no encontrada");
        if (entrada.siloId) {
            const silo = await database_1.default.silo.findUnique({ where: { id: entrada.siloId } });
            if (silo) {
                await database_1.default.silo.update({
                    where: { id: silo.id },
                    data: { stockActual: silo.stockActual - entrada.peso },
                });
            }
        }
        await database_1.default.entradaAlmacen.delete({ where: { id } });
    }
}
exports.EntradaService = EntradaService;
exports.entradaService = new EntradaService();
//# sourceMappingURL=entrada.service.js.map