import { Request, Response, NextFunction } from "express";
import { siloService } from "../services/silo.service";
import { ApiResponse } from "../utils/response";
import { asyncHandler } from "../middleware/error-handler";

export class SiloController {
  findAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const silos = await siloService.findAll();
    ApiResponse.success(res, silos);
  });

  findById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const silo = await siloService.findById(req.params.id);
    ApiResponse.success(res, silo);
  });

  create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const silo = await siloService.create(req.body);
    ApiResponse.success(res, silo, "Silo creado", 201);
  });

  update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const silo = await siloService.update(req.params.id, req.body);
    ApiResponse.success(res, silo, "Silo actualizado");
  });

  delete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await siloService.delete(req.params.id);
    ApiResponse.success(res, null, "Silo eliminado", 204);
  });

  updateStock = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { cantidad, operacion } = req.body;
    const silo = await siloService.updateStock(req.params.id, cantidad, operacion);
    ApiResponse.success(res, silo, "Stock actualizado");
  });

  getResumenOcupacion = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const resumen = await siloService.getResumenOcupacion();
    ApiResponse.success(res, resumen);
  });
}

export const siloController = new SiloController();