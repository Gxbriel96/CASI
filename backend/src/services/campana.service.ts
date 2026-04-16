import prisma from "../config/database";
import { NotFoundError, ValidationError } from "../utils/errors";

export class CampanaService {
  async findAll() {
    const campanas = await prisma.campana.findMany({
      orderBy: { fechaInicio: "desc" },
    });
    return campanas;
  }

  async findActive() {
    const campana = await prisma.campana.findFirst({
      where: { activa: true },
      orderBy: { fechaInicio: "desc" },
    });
    return campana;
  }

  async findById(id: string) {
    const campana = await prisma.campana.findUnique({ where: { id } });
    if (!campana) throw new NotFoundError("Campaña no encontrada");
    return campana;
  }

  async create(data: {
    nombre: string;
    precioBaseMaiz: number;
    precioBaseTrigo: number;
    porcentajeApoyo: number;
    fechaInicio: Date;
    fechaFin: Date;
  }) {
    if (new Date(data.fechaInicio) >= new Date(data.fechaFin)) {
      throw new ValidationError("La fecha de inicio debe ser anterior a la de fin");
    }

    await prisma.campana.updateMany({
      where: { activa: true },
      data: { activa: false },
    });

    const campana = await prisma.campana.create({ data });
    return campana;
  }

  async update(id: string, data: {
    nombre?: string;
    precioBaseMaiz?: number;
    precioBaseTrigo?: number;
    porcentajeApoyo?: number;
    fechaInicio?: Date;
    fechaFin?: Date;
    activa?: boolean;
  }) {
    if (data.fechaInicio && data.fechaFin && new Date(data.fechaInicio) >= new Date(data.fechaFin)) {
      throw new ValidationError("La fecha de inicio debe ser anterior a la de fin");
    }

    const campana = await prisma.campana.update({ where: { id }, data });
    return campana;
  }

  async delete(id: string) {
    const campana = await prisma.campana.findUnique({ where: { id } });
    if (!campana) throw new NotFoundError("Campaña no encontrada");

    if (campana.activa) {
      throw new ValidationError("No se puede eliminar una campaña activa");
    }

    await prisma.campana.delete({ where: { id } });
  }
}

export const campanaService = new CampanaService();