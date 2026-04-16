import prisma from "../config/database";
import { NotFoundError, ValidationError } from "../utils/errors";

export class SiloService {
  async findAll() {
    const silos = await prisma.silo.findMany({
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

  async findById(id: string) {
    const silo = await prisma.silo.findUnique({
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
      throw new NotFoundError("Silo no encontrado");
    }

    return {
      ...silo,
      porcentajeOcupacion: (silo.stockActual / silo.capacidad) * 100,
    };
  }

  async create(data: { nombre: string; capacidad: number; cultivo?: "MAIZ" | "TRIGO" | "CEBADA" }) {
    const existing = await prisma.silo.findUnique({ where: { nombre: data.nombre } });
    if (existing) {
      throw new ValidationError("Ya existe un silo con este nombre");
    }

    const silo = await prisma.silo.create({ data });
    return silo;
  }

  async update(id: string, data: { nombre?: string; capacidad?: number; cultivo?: "MAIZ" | "TRIGO" | "CEBADA" }) {
    const silo = await prisma.silo.update({ where: { id }, data });
    return silo;
  }

  async delete(id: string) {
    const silo = await prisma.silo.findUnique({ where: { id } });
    if (!silo) throw new NotFoundError("Silo no encontrado");

    if (silo.stockActual > 0) {
      throw new ValidationError("No se puede eliminar un silo con stock");
    }

    await prisma.silo.delete({ where: { id } });
  }

  async updateStock(id: string, cantidad: number, operacion: "agregar" | "quitar") {
    const silo = await prisma.silo.findUnique({ where: { id } });
    if (!silo) throw new NotFoundError("Silo no encontrado");

    let nuevoStock: number;
    if (operacion === "agregar") {
      nuevoStock = silo.stockActual + cantidad;
      if (nuevoStock > silo.capacidad) {
        throw new ValidationError("Stock excede la capacidad del silo");
      }
    } else {
      nuevoStock = silo.stockActual - cantidad;
      if (nuevoStock < 0) {
        throw new ValidationError("Stock no puede ser negativo");
      }
    }

    const updated = await prisma.silo.update({
      where: { id },
      data: { stockActual: nuevoStock },
    });

    return updated;
  }

  async getResumenOcupacion() {
    const silos = await prisma.silo.findMany();

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

export const siloService = new SiloService();