import { Request, Response, NextFunction } from "express";
import { cosechaService } from "../services/cosecha.service";
import { ApiResponse } from "../utils/response";
import { asyncHandler } from "../middleware/error-handler";

export class CosechaController {
  findAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const parcelaId = req.query.parcelaId as string;
    const cosechas = await cosechaService.findAll(parcelaId);
    ApiResponse.success(res, cosechas);
  });

  findById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const cosecha = await cosechaService.findById(req.params.id);
    ApiResponse.success(res, cosecha);
  });

  create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const data = {
      ...req.body,
      fechaSiembra: req.body.fechaSiembra ? new Date(req.body.fechaSiembra) : undefined,
      fechaCosecha: req.body.fechaCosecha ? new Date(req.body.fechaCosecha) : undefined,
    };
    const cosecha = await cosechaService.create(data);
    ApiResponse.success(res, cosecha, "Cosecha creada", 201);
  });

  update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const data = {
      ...req.body,
      fechaSiembra: req.body.fechaSiembra ? new Date(req.body.fechaSiembra) : undefined,
      fechaCosecha: req.body.fechaCosecha ? new Date(req.body.fechaCosecha) : undefined,
    };
    const cosecha = await cosechaService.update(req.params.id, data);
    ApiResponse.success(res, cosecha, "Cosecha actualizada");
  });

  delete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await cosechaService.delete(req.params.id);
    ApiResponse.success(res, null, "Cosecha eliminada", 204);
  });
}

export const cosechaController = new CosechaController();