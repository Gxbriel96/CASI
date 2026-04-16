import prisma from "../config/database";
import { NotFoundError, ValidationError } from "../utils/errors";

export class ParcelaService {
  async findAll(socioId?: string) {
    const where = socioId ? { socioId } : {};

    const parcelas = await prisma.parcela.findMany({
      where,
      include: {
        socio: { select: { id: true, numeroSocio: true, nombre: true } },
        cosechas: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return parcelas;
  }

  async findById(id: string) {
    const parcela = await prisma.parcela.findUnique({
      where: { id },
      include: {
        socio: true,
        cosechas: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!parcela) {
      throw new NotFoundError("Parcela no encontrada");
    }

    return parcela;
  }

  async create(data: {
    socioId: string;
    nombre: string;
    hectareas: number;
    ubicacion?: string;
    coordenadas?: string;
  }) {
    const socio = await prisma.socio.findUnique({ where: { id: data.socioId } });
    if (!socio) {
      throw new NotFoundError("Socio no encontrado");
    }

    const parcela = await prisma.parcela.create({ data });
    return parcela;
  }

  async update(id: string, data: {
    nombre?: string;
    hectareas?: number;
    ubicacion?: string;
    coordenadas?: string;
  }) {
    const parcela = await prisma.parcela.update({
      where: { id },
      data,
    });

    return parcela;
  }

  async delete(id: string) {
    const cosechas = await prisma.cosecha.count({ where: { parcelaId: id } });
    if (cosechas > 0) {
      throw new ValidationError("No se puede eliminar una parcela con cosechas asociadas");
    }

    await prisma.parcela.delete({ where: { id } });
  }

  async getTrazabilidad(id: string) {
    const parcela = await prisma.parcela.findUnique({
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
      throw new NotFoundError("Parcela no encontrada");
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

export const parcelaService = new ParcelaService();