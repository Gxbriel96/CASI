import { Request, Response, NextFunction } from "express";
import { socioService } from "../services/socio.service";
import { ApiResponse } from "../utils/response";
import { asyncHandler } from "../middleware/error-handler";

export class SocioController {
  findAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const result = await socioService.findAll(page, limit, search);
    ApiResponse.paginated(res, result.socios, page, limit, result.total);
  });

  findById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const socio = await socioService.findById(req.params.id);
    ApiResponse.success(res, socio);
  });

  create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const socio = await socioService.create(req.body);
    ApiResponse.success(res, socio, "Socio creado", 201);
  });

  update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const socio = await socioService.update(req.params.id, req.body);
    ApiResponse.success(res, socio, "Socio actualizado");
  });

  delete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await socioService.delete(req.params.id);
    ApiResponse.success(res, null, "Socio eliminado", 204);
  });

  getParcelas = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const parcelas = await socioService.getParcelas(req.params.id);
    ApiResponse.success(res, parcelas);
  });

  getEntradas = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await socioService.getEntradas(req.params.id, page, limit);
    ApiResponse.paginated(res, result.entradas, page, limit, result.total);
  });

  getLiquidaciones = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await socioService.getLiquidaciones(req.params.id, page, limit);
    ApiResponse.paginated(res, result.liquidaciones, page, limit, result.total);
  });
}

export const socioController = new SocioController();