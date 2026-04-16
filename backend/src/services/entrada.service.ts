import prisma from "../config/database";
import { NotFoundError } from "../utils/errors";

export class EntradaService {
  async findAll(page: number = 1, limit: number = 10, socioId?: string, siloId?: string) {
    const where: Record<string, unknown> = {};
    if (socioId) where.socioId = socioId;
    if (siloId) where.siloId = siloId;

    const [entradas, total] = await Promise.all([
      prisma.entradaAlmacen.findMany({
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
      prisma.entradaAlmacen.count({ where }),
    ]);

    return { entradas, total, page, limit };
  }

  async findById(id: string) {
    const entrada = await prisma.entradaAlmacen.findUnique({
      where: { id },
      include: {
        socio: true,
        cosecha: true,
        silo: true,
        controlCalidad: true,
      },
    });

    if (!entrada) {
      throw new NotFoundError("Entrada no encontrada");
    }

    return entrada;
  }

  async create(data: {
    socioId: string;
    cosechaId?: string;
    siloId?: string;
    peso: number;
    humedad: number;
    pesoEspecifico: number;
    temperatura: number;
    impurezas: number;
    usuarioId: string;
  }) {
    const socio = await prisma.socio.findUnique({ where: { id: data.socioId } });
    if (!socio) throw new NotFoundError("Socio no encontrado");

    if (data.siloId) {
      const silo = await prisma.silo.findUnique({ where: { id: data.siloId } });
      if (!silo) throw new NotFoundError("Silo no encontrado");
    }

    const entrada = await prisma.entradaAlmacen.create({
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
      const silo = await prisma.silo.findUnique({ where: { id: data.siloId } });
      if (silo) {
        await prisma.silo.update({
          where: { id: data.siloId },
          data: { stockActual: silo.stockActual + data.peso },
        });
      }
    }

    return entrada;
  }

  async update(id: string, data: { siloId?: string; peso?: number }) {
    const entrada = await prisma.entradaAlmacen.findUnique({ where: { id } });
    if (!entrada) throw new NotFoundError("Entrada no encontrada");

    if (data.siloId && data.siloId !== entrada.siloId) {
      const oldSilo = entrada.siloId ? await prisma.silo.findUnique({ where: { id: entrada.siloId } }) : null;
      if (oldSilo) {
        await prisma.silo.update({
          where: { id: oldSilo.id },
          data: { stockActual: oldSilo.stockActual - entrada.peso },
        });
      }

      const newSilo = await prisma.silo.findUnique({ where: { id: data.siloId } });
      if (!newSilo) throw new NotFoundError("Silo no encontrado");

      await prisma.silo.update({
        where: { id: data.siloId },
        data: { stockActual: newSilo.stockActual + entrada.peso },
      });
    }

    const updated = await prisma.entradaAlmacen.update({
      where: { id },
      data,
      include: { socio: true, silo: true },
    });

    return updated;
  }

  async delete(id: string) {
    const entrada = await prisma.entradaAlmacen.findUnique({ where: { id } });
    if (!entrada) throw new NotFoundError("Entrada no encontrada");

    if (entrada.siloId) {
      const silo = await prisma.silo.findUnique({ where: { id: entrada.siloId } });
      if (silo) {
        await prisma.silo.update({
          where: { id: silo.id },
          data: { stockActual: silo.stockActual - entrada.peso },
        });
      }
    }

    await prisma.entradaAlmacen.delete({ where: { id } });
  }
}

export const entradaService = new EntradaService();