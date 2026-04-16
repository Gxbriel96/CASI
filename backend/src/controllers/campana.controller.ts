import { Request, Response, NextFunction } from "express";
import { campanaService } from "../services/campana.service";
import { ApiResponse } from "../utils/response";
import { asyncHandler } from "../middleware/error-handler";

export class CampanaController {
  findAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const campanas = await campanaService.findAll();
    ApiResponse.success(res, campanas);
  });

  findActive = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const campana = await campanaService.findActive();
    ApiResponse.success(res, campana);
  });

  findById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const campana = await campanaService.findById(req.params.id);
    ApiResponse.success(res, campana);
  });

  create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const data = {
      ...req.body,
      fechaInicio: new Date(req.body.fechaInicio),
      fechaFin: new Date(req.body.fechaFin),
    };
    const campana = await campanaService.create(data);
    ApiResponse.success(res, campana, "Campaña creada", 201);
  });

  update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const data = {
      ...req.body,
      ...(req.body.fechaInicio && { fechaInicio: new Date(req.body.fechaInicio) }),
      ...(req.body.fechaFin && { fechaFin: new Date(req.body.fechaFin) }),
    };
    const campana = await campanaService.update(req.params.id, data);
    ApiResponse.success(res, campana, "Campaña actualizada");
  });

  delete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await campanaService.delete(req.params.id);
    ApiResponse.success(res, null, "Campaña eliminada", 204);
  });
}

export const campanaController = new CampanaController();