import { Request, Response, NextFunction } from "express";
import { parcelaService } from "../services/parcela.service";
import { ApiResponse } from "../utils/response";
import { asyncHandler } from "../middleware/error-handler";

export class ParcelaController {
  findAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const socioId = req.query.socioId as string;
    const parcelas = await parcelaService.findAll(socioId);
    ApiResponse.success(res, parcelas);
  });

  findById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const parcela = await parcelaService.findById(req.params.id);
    ApiResponse.success(res, parcela);
  });

  create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const parcela = await parcelaService.create(req.body);
    ApiResponse.success(res, parcela, "Parcela creada", 201);
  });

  update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const parcela = await parcelaService.update(req.params.id, req.body);
    ApiResponse.success(res, parcela, "Parcela actualizada");
  });

  delete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await parcelaService.delete(req.params.id);
    ApiResponse.success(res, null, "Parcela eliminada", 204);
  });

  getTrazabilidad = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const trazabilidad = await parcelaService.getTrazabilidad(req.params.id);
    ApiResponse.success(res, trazabilidad);
  });
}

export const parcelaController = new ParcelaController();