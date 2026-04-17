"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cosechaService = exports.CosechaService = void 0;
const database_1 = __importDefault(require("../config/database"));
const errors_1 = require("../utils/errors");
class CosechaService {
    async findAll(parcelaId) {
        const where = parcelaId ? { parcelaId } : {};
        const cosechas = await database_1.default.cosecha.findMany({
            where,
            include: {
                parcela: { include: { socio: true } },
                _count: { select: { entradas: true, liquidaciones: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        return cosechas;
    }
    async findById(id) {
        const cosecha = await database_1.default.cosecha.findUnique({
            where: { id },
            include: {
                parcela: { include: { socio: true } },
                entradas: { include: { controlCalidad: true, silo: true } },
                liquidaciones: true,
            },
        });
        if (!cosecha) {
            throw new errors_1.NotFoundError("Cosecha no encontrada");
        }
        return cosecha;
    }
    async create(data) {
        const parcela = await database_1.default.parcela.findUnique({ where: { id: data.parcelaId } });
        if (!parcela) {
            throw new errors_1.NotFoundError("Parcela no encontrada");
        }
        const cosecha = await database_1.default.cosecha.create({ data });
        return cosecha;
    }
    async update(id, data) {
        const cosecha = await database_1.default.cosecha.update({ where: { id }, data });
        return cosecha;
    }
    async delete(id) {
        const tieneEntradas = await database_1.default.entradaAlmacen.count({ where: { cosechaId: id } });
        if (tieneEntradas > 0) {
            throw new errors_1.ValidationError("No se puede eliminar una cosecha con entradas asociadas");
        }
        await database_1.default.cosecha.delete({ where: { id } });
    }
}
exports.CosechaService = CosechaService;
exports.cosechaService = new CosechaService();
//# sourceMappingURL=cosecha.service.js.map