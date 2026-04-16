import { Request, Response, NextFunction } from "express";
import { liquidacionService } from "../services/liquidacion.service";
import { ApiResponse } from "../utils/response";
import { asyncHandler } from "../middleware/error-handler";

export class LiquidacionController {
  findAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const socioId = req.query.socioId as string;

    const result = await liquidacionService.findAll(page, limit, socioId);
    ApiResponse.paginated(res, result.liquidaciones, page, limit, result.total);
  });

  findById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const liquidacion = await liquidacionService.findById(req.params.id);
    ApiResponse.success(res, liquidacion);
  });

  findBySocio = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await liquidacionService.findBySocio(req.params.id, page, limit);
    ApiResponse.paginated(res, result.liquidaciones, page, limit, result.total);
  });

  create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const liquidacion = await liquidacionService.create(req.body);
    ApiResponse.success(res, liquidacion, "Liquidación creada", 201);
  });

  calcular = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { socioId, cosechaId } = req.body;
    const calculo = await liquidacionService.calcular(socioId, cosechaId);
    ApiResponse.success(res, calculo);
  });

  delete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await liquidacionService.delete(req.params.id);
    ApiResponse.success(res, null, "Liquidación eliminada", 204);
  });

  getEstadisticas = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const stats = await liquidacionService.getEstadisticas();
    ApiResponse.success(res, stats);
  });
}

export const liquidacionController = new LiquidacionController();