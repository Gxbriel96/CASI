import { Request, Response, NextFunction } from "express";
import { dashboardService } from "../services/dashboard.service";
import { ApiResponse } from "../utils/response";
import { asyncHandler } from "../middleware/error-handler";

export class DashboardController {
  getMetricas = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const metricas = await dashboardService.getMetricas();
    ApiResponse.success(res, metricas);
  });

  getOcupacionSilos = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const ocupacion = await dashboardService.getOcupacionSilos();
    ApiResponse.success(res, ocupacion);
  });

  getEntradasPorCultivo = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const entradas = await dashboardService.getEntradasPorCultivo();
    ApiResponse.success(res, entradas);
  });

  getTopSocios = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const top = await dashboardService.getTopSocios(limit);
    ApiResponse.success(res, top);
  });
}

export const dashboardController = new DashboardController();