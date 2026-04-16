import { Request, Response, NextFunction } from "express";
import { frutaService } from "../services/fruta.service";
import { ApiResponse } from "../utils/response";
import { asyncHandler } from "../middleware/error-handler";

export class FrutaController {
  findAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const socioId = req.query.socioId as string;
    const especie = req.query.especie as string;

    const result = await frutaService.findAll(page, limit, socioId, especie);
    ApiResponse.paginated(res, result.frutas, page, limit, result.total);
  });

  findById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const fruta = await frutaService.findById(req.params.id);
    ApiResponse.success(res, fruta);
  });

  create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const fruta = await frutaService.create({
      ...req.body,
      usuarioId: req.user!.userId,
    });
    ApiResponse.success(res, fruta, "Control de fruta registrado", 201);
  });

  delete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await frutaService.delete(req.params.id);
    ApiResponse.success(res, null, "Control de fruta eliminado", 204);
  });

  getEstadisticas = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const socioId = req.query.socioId as string;
    const stats = await frutaService.getEstadisticas(socioId);
    ApiResponse.success(res, stats);
  });
}

export const frutaController = new FrutaController();