"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcelaService = exports.ParcelaService = void 0;
const database_1 = __importDefault(require("../config/database"));
const errors_1 = require("../utils/errors");
class ParcelaService {
    async findAll(socioId) {
        const where = socioId ? { socioId } : {};
        const parcelas = await database_1.default.parcela.findMany({
            where,
            include: {
                socio: { select: { id: true, numeroSocio: true, nombre: true } },
                cosechas: { orderBy: { createdAt: "desc" } },
            },
            orderBy: { createdAt: "desc" },
        });
        return parcelas;
    }
    async findById(id) {
        const parcela = await database_1.default.parcela.findUnique({
            where: { id },
            include: {
                socio: true,
                cosechas: { orderBy: { createdAt: "desc" } },
            },
        });
        if (!parcela) {
            throw new errors_1.NotFoundError("Parcela no encontrada");
        }
        return parcela;
    }
    async create(data) {
        const socio = await database_1.default.socio.findUnique({ where: { id: data.socioId } });
        if (!socio) {
            throw new errors_1.NotFoundError("Socio no encontrado");
        }
        const parcela = await database_1.default.parcela.create({ data });
        return parcela;
    }
    async update(id, data) {
        const parcela = await database_1.default.parcela.update({
            where: { id },
            data,
        });
        return parcela;
    }
    async delete(id) {
        const cosechas = await database_1.default.cosecha.count({ where: { parcelaId: id } });
        if (cosechas > 0) {
            throw new errors_1.ValidationError("No se puede eliminar una parcela con cosechas asociadas");
        }
        await database_1.default.parcela.delete({ where: { id } });
    }
    async getTrazabilidad(id) {
        const parcela = await database_1.default.parcela.findUnique({
            where: { id },
            include: {
                socio: true,
                cosechas: {
                    include: {
                        entradas: {
                            include: {
                                controlCalidad: true,
                                silo: true,
                            },
                            orderBy: { createdAt: "desc" },
                        },
                    },
                },
            },
        });
        if (!parcela) {
            throw new errors_1.NotFoundError("Parcela no encontrada");
        }
        const trazabilidad = {
            parcela: {
                id: parcela.id,
                nombre: parcela.nombre,
                hectareas: parcela.hectareas,
                ubicacion: parcela.ubicacion,
                coordenadas: parcela.coordenadas,
            },
            socio: {
                id: parcela.socio.id,
                numeroSocio: parcela.socio.numeroSocio,
                nombre: parcela.socio.nombre,
            },
            historial: parcela.cosechas.map((cosecha) => ({
                cosecha: {
                    id: cosecha.id,
                    cultivo: cosecha.cultivo,
                    rendimiento: cosecha.rendimiento,
                    fechaSiembra: cosecha.fechaSiembra,
                    fechaCosecha: cosecha.fechaCosecha,
                },
                entradas: cosecha.entradas.map((entrada) => ({
                    id: entrada.id,
                    fecha: entrada.createdAt,
                    peso: entrada.peso,
                    humedad: entrada.humedad,
                    pesoEspecifico: entrada.pesoEspecifico,
                    temperatura: entrada.temperatura,
                    impurezas: entrada.impurezas,
                    resultadoCalidad: entrada.controlCalidad?.resultado,
                    silo: entrada.silo?.nombre,
                })),
            })),
        };
        return trazabilidad;
    }
}
exports.ParcelaService = ParcelaService;
exports.parcelaService = new ParcelaService();
//# sourceMappingURL=parcela.service.js.map