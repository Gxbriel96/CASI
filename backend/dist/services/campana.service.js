"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campanaService = exports.CampanaService = void 0;
const database_1 = __importDefault(require("../config/database"));
const errors_1 = require("../utils/errors");
class CampanaService {
    async findAll() {
        const campanas = await database_1.default.campana.findMany({
            orderBy: { fechaInicio: "desc" },
        });
        return campanas;
    }
    async findActive() {
        const campana = await database_1.default.campana.findFirst({
            where: { activa: true },
            orderBy: { fechaInicio: "desc" },
        });
        return campana;
    }
    async findById(id) {
        const campana = await database_1.default.campana.findUnique({ where: { id } });
        if (!campana)
            throw new errors_1.NotFoundError("Campaña no encontrada");
        return campana;
    }
    async create(data) {
        if (new Date(data.fechaInicio) >= new Date(data.fechaFin)) {
            throw new errors_1.ValidationError("La fecha de inicio debe ser anterior a la de fin");
        }
        await database_1.default.campana.updateMany({
            where: { activa: true },
            data: { activa: false },
        });
        const campana = await database_1.default.campana.create({ data });
        return campana;
    }
    async update(id, data) {
        if (data.fechaInicio && data.fechaFin && new Date(data.fechaInicio) >= new Date(data.fechaFin)) {
            throw new errors_1.ValidationError("La fecha de inicio debe ser anterior a la de fin");
        }
        const campana = await database_1.default.campana.update({ where: { id }, data });
        return campana;
    }
    async delete(id) {
        const campana = await database_1.default.campana.findUnique({ where: { id } });
        if (!campana)
            throw new errors_1.NotFoundError("Campaña no encontrada");
        if (campana.activa) {
            throw new errors_1.ValidationError("No se puede eliminar una campaña activa");
        }
        await database_1.default.campana.delete({ where: { id } });
    }
}
exports.CampanaService = CampanaService;
exports.campanaService = new CampanaService();
//# sourceMappingURL=campana.service.js.map