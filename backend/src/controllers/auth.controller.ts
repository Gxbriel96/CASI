import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { ApiResponse } from "../utils/response";
import { asyncHandler } from "../middleware/error-handler";
import { validate } from "../middleware/validate.middleware";
import { loginSchema, registerSchema } from "../types/schemas";

export class AuthController {
  login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    ApiResponse.success(res, result, "Login exitoso");
  });

  refresh = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    ApiResponse.success(res, result, "Token refrescado");
  });

  me = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await authService.me(req.user!.userId);
    ApiResponse.success(res, user);
  });

  register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, nombre, rol } = req.body;
    const result = await authService.register(email, password, nombre, rol);
    ApiResponse.success(res, result, "Usuario registrado", 201);
  });
}

export const authController = new AuthController();