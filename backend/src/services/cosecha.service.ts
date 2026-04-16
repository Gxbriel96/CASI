import prisma from "../config/database";
import { NotFoundError, ValidationError } from "../utils/errors";

export class CosechaService {
  async findAll(parcelaId?: string) {
    const where = parcelaId ? { parcelaId } : {};

    const cosechas = await prisma.cosecha.findMany({
      where,
      include: {
        parcela: { include: { socio: true } },
        _count: { select: { entradas: true, liquidaciones: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return cosechas;
  }

  async findById(id: string) {
    const cosecha = await prisma.cosecha.findUnique({
      where: { id },
      include: {
        parcela: { include: { socio: true } },
        entradas: { include: { controlCalidad: true, silo: true } },
        liquidaciones: true,
      },
    });

    if (!cosecha) {
      throw new NotFoundError("Cosecha no encontrada");
    }

    return cosecha;
  }

  async create(data: {
    parcelaId: string;
    cultivo: "MAIZ" | "TRIGO" | "CEBADA";
    rendimiento?: number;
    fechaSiembra?: Date;
    fechaCosecha?: Date;
  }) {
    const parcela = await prisma.parcela.findUnique({ where: { id: data.parcelaId } });
    if (!parcela) {
      throw new NotFoundError("Parcela no encontrada");
    }

    const cosecha = await prisma.cosecha.create({ data });
    return cosecha;
  }

  async update(id: string, data: {
    cultivo?: "MAIZ" | "TRIGO" | "CEBADA";
    rendimiento?: number;
    fechaSiembra?: Date;
    fechaCosecha?: Date;
  }) {
    const cosecha = await prisma.cosecha.update({ where: { id }, data });
    return cosecha;
  }

  async delete(id: string) {
    const tieneEntradas = await prisma.entradaAlmacen.count({ where: { cosechaId: id } });
    if (tieneEntradas > 0) {
      throw new ValidationError("No se puede eliminar una cosecha con entradas asociadas");
    }

    await prisma.cosecha.delete({ where: { id } });
  }
}

export const cosechaService = new CosechaService();