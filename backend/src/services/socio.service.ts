import prisma from "../config/database";
import { NotFoundError, ConflictError, ValidationError } from "../utils/errors";

export class SocioService {
  async findAll(page: number = 1, limit: number = 10, search?: string) {
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
      prisma.socio.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          parcelas: true,
          _count: { select: { parcelas: true, entradas: true, liquidaciones: true } },
        },
      }),
      prisma.socio.count({ where }),
    ]);

    return { socios, total, page, limit };
  }

  async findById(id: string) {
    const socio = await prisma.socio.findUnique({
      where: { id },
      include: {
        parcelas: { include: { cosechas: true } },
        usuario: { select: { id: true, email: true, rol: true } },
      },
    });

    if (!socio) {
      throw new NotFoundError("Socio no encontrado");
    }

    return socio;
  }

  async create(data: { nombre: string; telefono?: string; email?: string; direccion?: string }) {
    const lastSocio = await prisma.socio.findFirst({
      orderBy: { numeroSocio: "desc" },
    });

    const nextNumber = lastSocio
      ? parseInt(lastSocio.numeroSocio) + 1
      : 1;

    const numeroSocio = nextNumber.toString().padStart(4, "0");

    const socio = await prisma.socio.create({
      data: {
        numeroSocio,
        ...data,
      },
    });

    return socio;
  }

  async update(id: string, data: { nombre?: string; telefono?: string; email?: string; direccion?: string }) {
    const socio = await prisma.socio.update({
      where: { id },
      data,
    });

    return socio;
  }

  async delete(id: string) {
    const entradas = await prisma.entradaAlmacen.count({ where: { socioId: id } });
    const liquidaciones = await prisma.liquidacion.count({ where: { socioId: id } });

    if (entradas > 0 || liquidaciones > 0) {
      throw new ValidationError("No se puede eliminar un socio con entradas o liquidaciones asociadas");
    }

    await prisma.socio.delete({ where: { id } });
  }

  async getParcelas(socioId: string) {
    const parcelas = await prisma.parcela.findMany({
      where: { socioId },
      include: { cosechas: true },
    });

    return parcelas;
  }

  async getEntradas(socioId: string, page: number = 1, limit: number = 10) {
    const [entradas, total] = await Promise.all([
      prisma.entradaAlmacen.findMany({
        where: { socioId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { controlCalidad: true, silo: true },
      }),
      prisma.entradaAlmacen.count({ where: { socioId } }),
    ]);

    return { entradas, total, page, limit };
  }

  async getLiquidaciones(socioId: string, page: number = 1, limit: number = 10) {
    const [liquidaciones, total] = await Promise.all([
      prisma.liquidacion.findMany({
        where: { socioId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { fechaLiquidacion: "desc" },
        include: { cosecha: true },
      }),
      prisma.liquidacion.count({ where: { socioId } }),
    ]);

    return { liquidaciones, total, page, limit };
  }
}

export const socioService = new SocioService();