"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlCalidadService = exports.ControlCalidadService = void 0;
const database_1 = __importDefault(require("../config/database"));
const errors_1 = require("../utils/errors");
class ControlCalidadService {
    async findAll(page = 1, limit = 10, resultado) {
        const where = resultado ? { resultado: resultado } : {};
        const [controles, total] = await Promise.all([
            database_1.default.controlCalidad.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    entrada: { include: { socio: true, silo: true } },
                },
            }),
            database_1.default.controlCalidad.count({ where }),
        ]);
        return { controles, total, page, limit };
    }
    async findById(id) {
        const control = await database_1.default.controlCalidad.findUnique({
            where: { id },
            include: { entrada: { include: { socio: true, silo: true } } },
        });
        if (!control) {
            throw new errors_1.NotFoundError("Control de calidad no encontrado");
        }
        return control;
    }
    async create(data) {
        const entrada = await database_1.default.entradaAlmacen.findUnique({
            where: { id: data.entradaAlmacenId },
        });
        if (!entrada) {
            throw new errors_1.NotFoundError("Entrada no encontrada");
        }
        const existingControl = await database_1.default.controlCalidad.findUnique({
            where: { entradaAlmacenId: data.entradaAlmacenId },
        });
        if (existingControl) {
            throw new errors_1.ValidationError("Ya existe un control de calidad para esta entrada");
        }
        let resultado = "APROBADO";
        if (data.humedad > 14 || data.pesoEspecifico < 76 || data.temperatura > 25 || data.impurezas > 2) {
            resultado = "RECHAZADO";
        }
        const control = await database_1.default.controlCalidad.create({
            data: {
                entradaAlmacenId: data.entradaAlmacenId,
                humedad: data.humedad,
                pesoEspecifico: data.pesoEspecifico,
                temperatura: data.temperatura,
                impurezas: data.impurezas,
                observaciones: data.observaciones,
                resultado,
            },
            include: { entrada: { include: { socio: true } } },
        });
        return control;
    }
    async updateResultado(id, resultado, observaciones) {
        const control = await database_1.default.controlCalidad.update({
            where: { id },
            data: { resultado, observaciones },
            include: { entrada: { include: { socio: true } } },
        });
        return control;
    }
}
exports.ControlCalidadService = ControlCalidadService;
exports.controlCalidadService = new ControlCalidadService();
//# sourceMappingURL=control-calidad.service.js.map