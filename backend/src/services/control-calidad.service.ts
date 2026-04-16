import prisma from "../config/database";
import { NotFoundError, ValidationError } from "../utils/errors";

export class ControlCalidadService {
  async findAll(page: number = 1, limit: number = 10, resultado?: string) {
    const where = resultado ? { resultado: resultado as "APROBADO" | "RECHAZADO" } : {};

    const [controles, total] = await Promise.all([
      prisma.controlCalidad.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          entrada: { include: { socio: true, silo: true } },
        },
      }),
      prisma.controlCalidad.count({ where }),
    ]);

    return { controles, total, page, limit };
  }

  async findById(id: string) {
    const control = await prisma.controlCalidad.findUnique({
      where: { id },
      include: { entrada: { include: { socio: true, silo: true } } },
    });

    if (!control) {
      throw new NotFoundError("Control de calidad no encontrado");
    }

    return control;
  }

  async create(data: {
    entradaAlmacenId: string;
    humedad: number;
    pesoEspecifico: number;
    temperatura: number;
    impurezas: number;
    observaciones?: string;
  }) {
    const entrada = await prisma.entradaAlmacen.findUnique({
      where: { id: data.entradaAlmacenId },
    });

    if (!entrada) {
      throw new NotFoundError("Entrada no encontrada");
    }

    const existingControl = await prisma.controlCalidad.findUnique({
      where: { entradaAlmacenId: data.entradaAlmacenId },
    });

    if (existingControl) {
      throw new ValidationError("Ya existe un control de calidad para esta entrada");
    }

    let resultado: "APROBADO" | "RECHAZADO" = "APROBADO";
    if (data.humedad > 14 || data.pesoEspecifico < 76 || data.temperatura > 25 || data.impurezas > 2) {
      resultado = "RECHAZADO";
    }

    const control = await prisma.controlCalidad.create({
      data: {
        entradaAlmacenId: data.entradaAlmacenId,
        humedad: data.humedad,
        pesoEspecifico: data.pesoEspecifico,
        temperatura: data.temperatura,
        impurezas: data.impurezas,
        observaciones: data.observaciones,
        resultado,
      },
      include: { entrada: { include: { socio: true } } },
    });

    return control;
  }

  async updateResultado(id: string, resultado: "APROBADO" | "RECHAZADO", observaciones?: string) {
    const control = await prisma.controlCalidad.update({
      where: { id },
      data: { resultado, observaciones },
      include: { entrada: { include: { socio: true } } },
    });

    return control;
  }
}

export const controlCalidadService = new ControlCalidadService();