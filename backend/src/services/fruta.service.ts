import prisma from "../config/database";
import { NotFoundError } from "../utils/errors";

export class FrutaService {
  async findAll(page: number = 1, limit: number = 10, socioId?: string, especie?: string) {
    const where: Record<string, unknown> = {};
    if (socioId) where.socioId = socioId;
    if (especie) where.especie = especie;

    const [frutas, total] = await Promise.all([
      prisma.frutaControl.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          socio: { select: { id: true, numeroSocio: true, nombre: true } },
        },
      }),
      prisma.frutaControl.count({ where }),
    ]);

    return { frutas, total, page, limit };
  }

  async findById(id: string) {
    const fruta = await prisma.frutaControl.findUnique({
      where: { id },
      include: { socio: true },
    });

    if (!fruta) {
      throw new NotFoundError("Control de fruta no encontrado");
    }

    return fruta;
  }

  async create(data: {
    socioId: string;
    especie: "MELOCOTON" | "NECTARINA" | "ALBARICOQUE" | "CIRUELA";
    variedad?: string;
    calibre: "AA" | "A" | "B" | "C";
    azucar: number;
    dureza: number;
    defectos: number;
    observaciones?: string;
    usuarioId: string;
  }) {
    const socio = await prisma.socio.findUnique({ where: { id: data.socioId } });
    if (!socio) throw new NotFoundError("Socio no encontrado");

    const fruta = await prisma.frutaControl.create({
      data,
      include: { socio: true },
    });

    return fruta;
  }

  async delete(id: string) {
    await prisma.frutaControl.delete({ where: { id } });
  }

  async getEstadisticas(socioId?: string) {
    const where = socioId ? { socioId } : {};

    const [total, porEspecie, porCalibre, promedioAzucar, promedioDureza] = await Promise.all([
      prisma.frutaControl.count({ where }),
      prisma.frutaControl.groupBy({
        by: ["especie"],
        where,
        _count: true,
      }),
      prisma.frutaControl.groupBy({
        by: ["calibre"],
        where,
        _count: true,
      }),
      prisma.frutaControl.aggregate({
        where,
        _avg: { azucar: true },
      }),
      prisma.frutaControl.aggregate({
        where,
        _avg: { dureza: true },
      }),
    ]);

    return {
      total,
      porEspecie: porEspecie.map((e) => ({ especie: e.especie, count: e._count })),
      porCalibre: porCalibre.map((c) => ({ calibre: c.calibre, count: c._count })),
      promedioAzucar: promedioAzucar._avg.azucar || 0,
      promedioDureza: promedioDureza._avg.dureza || 0,
    };
  }
}

export const frutaService = new FrutaService();