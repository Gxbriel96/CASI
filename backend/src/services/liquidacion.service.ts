import prisma from "../config/database";
import { NotFoundError, ValidationError } from "../utils/errors";

export class LiquidacionService {
  async findAll(page: number = 1, limit: number = 10, socioId?: string) {
    const where = socioId ? { socioId } : {};

    const [liquidaciones, total] = await Promise.all([
      prisma.liquidacion.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { fechaLiquidacion: "desc" },
        include: {
          socio: { select: { id: true, numeroSocio: true, nombre: true } },
          cosecha: true,
        },
      }),
      prisma.liquidacion.count({ where }),
    ]);

    return { liquidaciones, total, page, limit };
  }

  async findById(id: string) {
    const liquidacion = await prisma.liquidacion.findUnique({
      where: { id },
      include: {
        socio: true,
        cosecha: { include: { parcela: true } },
      },
    });

    if (!liquidacion) {
      throw new NotFoundError("Liquidación no encontrada");
    }

    return liquidacion;
  }

  async findBySocio(socioId: string, page: number = 1, limit: number = 10) {
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

  async create(data: {
    socioId: string;
    cosechaId?: string;
    totalKilos: number;
    precioBase: number;
    porcentajeApoyo?: number;
  }) {
    const socio = await prisma.socio.findUnique({ where: { id: data.socioId } });
    if (!socio) throw new NotFoundError("Socio no encontrado");

    const importeBruto = data.totalKilos * data.precioBase;
    const apoyoGobierno = data.porcentajeApoyo
      ? importeBruto * (data.porcentajeApoyo / 100)
      : 0;
    const importeTotal = importeBruto + apoyoGobierno;

    const liquidacion = await prisma.liquidacion.create({
      data: {
        socioId: data.socioId,
        cosechaId: data.cosechaId,
        totalKilos: data.totalKilos,
        precioBase: data.precioBase,
        importeBruto,
        apoyoGobierno,
        importeTotal,
      },
      include: { socio: true },
    });

    return liquidacion;
  }

  async calcular(socioId: string, cosechaId?: string) {
    const socio = await prisma.socio.findUnique({ where: { id: socioId } });
    if (!socio) throw new NotFoundError("Socio no encontrado");

    const campana = await prisma.campana.findFirst({
      where: { activa: true },
      orderBy: { fechaInicio: "desc" },
    });

    if (!campana) {
      throw new ValidationError("No hay campaña activa configurada");
    }

    const where: Record<string, unknown> = { socioId };
    if (cosechaId) where.cosechaId = cosechaId;

    const entradas = await prisma.entradaAlmacen.findMany({
      where,
      include: {
        cosecha: true,
        controlCalidad: { where: { resultado: "APROBADO" } },
      },
    });

    if (entradas.length === 0) {
      throw new ValidationError("No hay entradas aprobadas para liquidar");
    }

    const totalKilos = entradas.reduce((acc, e) => acc + e.peso, 0);
    const cultivo = entradas[0].cosecha?.cultivo;
    const precioBase = cultivo === "TRIGO" ? campana.precioBaseTrigo : campana.precioBaseMaiz;

    const importeBruto = totalKilos * precioBase;
    const apoyoGobierno = importeBruto * (campana.porcentajeApoyo / 100);
    const importeTotal = importeBruto + apoyoGobierno;

    return {
      socio: { id: socio.id, numeroSocio: socio.numeroSocio, nombre: socio.nombre },
      totalEntradas: entradas.length,
      totalKilos: parseFloat(totalKilos.toFixed(2)),
      cultivo,
      precioBase,
      importeBruto: parseFloat(importeBruto.toFixed(2)),
      apoyoGobierno: parseFloat(apoyoGobierno.toFixed(2)),
      importeTotal: parseFloat(importeTotal.toFixed(2)),
      porcentajeApoyo: campana.porcentajeApoyo,
    };
  }

  async delete(id: string) {
    await prisma.liquidacion.delete({ where: { id } });
  }

  async getEstadisticas() {
    const [aggregated, porSocio, porMes] = await Promise.all([
      prisma.liquidacion.aggregate({
        _sum: { importeTotal: true, totalKilos: true, apoyoGobierno: true },
        _count: true,
      }),
      prisma.liquidacion.groupBy({
        by: ["socioId"],
        _sum: { importeTotal: true, totalKilos: true },
        _count: true,
        orderBy: { _sum: { importeTotal: "desc" } },
        take: 10,
      }),
      prisma.$queryRaw`
        SELECT DATE_TRUNC('month', fechaLiquidacion) as mes,
               SUM(importeTotal) as total, SUM(totalKilos) as kilos
        FROM "Liquidacion"
        GROUP BY DATE_TRUNC('month', fechaLiquidacion)
        ORDER BY mes DESC
        LIMIT 12
      `,
    ]);

    return {
      totalLiquidaciones: aggregated._count,
      importeTotal: aggregated._sum.importeTotal || 0,
      totalKilos: aggregated._sum.totalKilos || 0,
      apoyoGobierno: aggregated._sum.apoyoGobierno || 0,
      topSocios: porSocio.map((s) => ({
        socioId: s.socioId,
        importeTotal: s._sum.importeTotal || 0,
        totalKilos: s._sum.totalKilos || 0,
      })),
      porMes,
    };
  }
}

export const liquidacionService = new LiquidacionService();