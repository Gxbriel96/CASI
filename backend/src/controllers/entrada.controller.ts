import { Request, Response, NextFunction } from "express";
import { entradaService } from "../services/entrada.service";
import { ApiResponse } from "../utils/response";
import { asyncHandler } from "../middleware/error-handler";

export class EntradaController {
  findAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const socioId = req.query.socioId as string;
    const siloId = req.query.siloId as string;

    const result = await entradaService.findAll(page, limit, socioId, siloId);
    ApiResponse.paginated(res, result.entradas, page, limit, result.total);
  });

  findById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const entrada = await entradaService.findById(req.params.id);
    ApiResponse.success(res, entrada);
  });

  create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const entrada = await entradaService.create({
      ...req.body,
      usuarioId: req.user!.userId,
    });
    ApiResponse.success(res, entrada, "Entrada registrada", 201);
  });

  update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const entrada = await entradaService.update(req.params.id, req.body);
    ApiResponse.success(res, entrada, "Entrada actualizada");
  });

  delete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await entradaService.delete(req.params.id);
    ApiResponse.success(res, null, "Entrada eliminada", 204);
  });
}

export const entradaController = new EntradaController();