import prisma from "../config/database";

export class DashboardService {
  async getMetricas() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalSocios,
      totalParcelas,
      hoyEntradas,
      totalEntradasMes,
      totalLiquidaciones,
      importeTotalLiquidado,
      ultimaCampana,
    ] = await Promise.all([
      prisma.socio.count(),
      prisma.parcela.count(),
      prisma.entradaAlmacen.count({ where: { createdAt: { gte: today } } }),
      prisma.entradaAlmacen.count({
        where: {
          createdAt: {
            gte: new Date(today.getFullYear(), today.getMonth(), 1),
          },
        },
      }),
      prisma.liquidacion.count(),
      prisma.liquidacion.aggregate({ _sum: { importeTotal: true } }),
      prisma.campana.findFirst({ where: { activa: true }, orderBy: { fechaInicio: "desc" } }),
    ]);

    const rendimientoPorHectarea = await prisma.cosecha.findMany({
      where: { rendimiento: { not: null } },
      include: { parcela: true },
    });

    const rendimientoPromedio = rendimientoPorHectarea.length > 0
      ? rendimientoPorHectarea.reduce((acc, c) => acc + (c.rendimiento || 0), 0) / rendimientoPorHectarea.length
      : 0;

    return {
      totalSocios,
      totalParcelas,
      hoyEntradas,
      totalEntradasMes,
      totalLiquidaciones,
      importeTotalLiquidado: importeTotalLiquidado._sum.importeTotal || 0,
      rendimientoPromedioHectarea: parseFloat(rendimientoPromedio.toFixed(2)),
      campanaActiva: ultimaCampana
        ? {
            id: ultimaCampana.id,
            nombre: ultimaCampana.nombre,
            precioBaseMaiz: ultimaCampana.precioBaseMaiz,
            precioBaseTrigo: ultimaCampana.precioBaseTrigo,
            porcentajeApoyo: ultimaCampana.porcentajeApoyo,
          }
        : null,
    };
  }

  async getOcupacionSilos() {
    const silos = await prisma.silo.findMany();

    const totalCapacidad = silos.reduce((acc, s) => acc + s.capacidad, 0);
    const totalStock = silos.reduce((acc, s) => acc + s.stockActual, 0);

    return {
      totalSilos: silos.length,
      totalCapacidad,
      totalStock,
      porcentajeOcupacion: totalCapacidad > 0 ? parseFloat(((totalStock / totalCapacidad) * 100).toFixed(2)) : 0,
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

  async getEntradasPorCultivo() {
    const entradas = await prisma.entradaAlmacen.findMany({
      include: { cosecha: true },
    });

    const porCultivo = entradas.reduce(
      (acc, e) => {
        const cultivo = e.cosecha?.cultivo || "SIN_CAMPAÑA";
        if (!acc[cultivo]) {
          acc[cultivo] = { cantidad: 0, peso: 0 };
        }
        acc[cultivo].cantidad += 1;
        acc[cultivo].peso += e.peso;
        return acc;
      },
      {} as Record<string, { cantidad: number; peso: number }>
    );

    return Object.entries(porCultivo).map(([cultivo, data]) => ({
      cultivo,
      cantidad: data.cantidad,
      peso: parseFloat(data.peso.toFixed(2)),
    }));
  }

  async getTopSocios(limit: number = 10) {
    const top = await prisma.liquidacion.groupBy({
      by: ["socioId"],
      _sum: { importeTotal: true, totalKilos: true },
      orderBy: { _sum: { importeTotal: "desc" } },
      take: limit,
    });

    const socios = await prisma.socio.findMany({
      where: { id: { in: top.map((t) => t.socioId) } },
    });

    const socioMap = new Map(socios.map((s) => [s.id, s]));

    return top.map((t) => ({
      socio: socioMap.get(t.socioId),
      totalKilos: t._sum.totalKilos || 0,
      importeTotal: t._sum.importeTotal || 0,
    }));
  }
}

export const dashboardService = new DashboardService();