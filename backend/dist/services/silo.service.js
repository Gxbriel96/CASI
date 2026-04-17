"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.siloService = exports.SiloService = void 0;
const database_1 = __importDefault(require("../config/database"));
const errors_1 = require("../utils/errors");
class SiloService {
    async findAll() {
        const silos = await database_1.default.silo.findMany({
            orderBy: { nombre: "asc" },
            include: {
                _count: { select: { entradas: true } },
            },
        });
        return silos.map((silo) => ({
            ...silo,
            porcentajeOcupacion: (silo.stockActual / silo.capacidad) * 100,
        }));
    }
    async findById(id) {
        const silo = await database_1.default.silo.findUnique({
            where: { id },
            include: {
                entradas: {
                    take: 10,
                    orderBy: { createdAt: "desc" },
                    include: { socio: { select: { numeroSocio: true, nombre: true } } },
                },
            },
        });
        if (!silo) {
            throw new errors_1.NotFoundError("Silo no encontrado");
        }
        return {
            ...silo,
            porcentajeOcupacion: (silo.stockActual / silo.capacidad) * 100,
        };
    }
    async create(data) {
        const existing = await database_1.default.silo.findUnique({ where: { nombre: data.nombre } });
        if (existing) {
            throw new errors_1.ValidationError("Ya existe un silo con este nombre");
        }
        const silo = await database_1.default.silo.create({ data });
        return silo;
    }
    async update(id, data) {
        const silo = await database_1.default.silo.update({ where: { id }, data });
        return silo;
    }
    async delete(id) {
        const silo = await database_1.default.silo.findUnique({ where: { id } });
        if (!silo)
            throw new errors_1.NotFoundError("Silo no encontrado");
        if (silo.stockActual > 0) {
            throw new errors_1.ValidationError("No se puede eliminar un silo con stock");
        }
        await database_1.default.silo.delete({ where: { id } });
    }
    async updateStock(id, cantidad, operacion) {
        const silo = await database_1.default.silo.findUnique({ where: { id } });
        if (!silo)
            throw new errors_1.NotFoundError("Silo no encontrado");
        let nuevoStock;
        if (operacion === "agregar") {
            nuevoStock = silo.stockActual + cantidad;
            if (nuevoStock > silo.capacidad) {
                throw new errors_1.ValidationError("Stock excede la capacidad del silo");
            }
        }
        else {
            nuevoStock = silo.stockActual - cantidad;
            if (nuevoStock < 0) {
                throw new errors_1.ValidationError("Stock no puede ser negativo");
            }
        }
        const updated = await database_1.default.silo.update({
            where: { id },
            data: { stockActual: nuevoStock },
        });
        return updated;
    }
    async getResumenOcupacion() {
        const silos = await database_1.default.silo.findMany();
        const totalCapacidad = silos.reduce((acc, s) => acc + s.capacidad, 0);
        const totalStock = silos.reduce((acc, s) => acc + s.stockActual, 0);
        const promedioOcupacion = totalCapacidad > 0 ? (totalStock / totalCapacidad) * 100 : 0;
        return {
            totalSilos: silos.length,
            totalCapacidad,
            totalStock,
            promedioOcupacion: parseFloat(promedioOcupacion.toFixed(2)),
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
}
exports.SiloService = SiloService;
exports.siloService = new SiloService();
//# sourceMappingURL=silo.service.js.map