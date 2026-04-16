import { Request, Response, NextFunction } from "express";
import { controlCalidadService } from "../services/control-calidad.service";
import { ApiResponse } from "../utils/response";
import { asyncHandler } from "../middleware/error-handler";

export class ControlCalidadController {
  findAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const resultado = req.query.resultado as string;

    const result = await controlCalidadService.findAll(page, limit, resultado);
    ApiResponse.paginated(res, result.controles, page, limit, result.total);
  });

  findById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const control = await controlCalidadService.findById(req.params.id);
    ApiResponse.success(res, control);
  });

  create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const control = await controlCalidadService.create(req.body);
    ApiResponse.success(res, control, "Control de calidad registrado", 201);
  });

  updateResultado = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { resultado, observaciones } = req.body;
    const control = await controlCalidadService.updateResultado(req.params.id, resultado, observaciones);
    ApiResponse.success(res, control, "Resultado actualizado");
  });
}

export const controlCalidadController = new ControlCalidadController();