"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
const error_handler_1 = require("../middleware/error-handler");
class AuthController {
    constructor() {
        this.login = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const { email, password } = req.body;
            const result = await auth_service_1.authService.login(email, password);
            response_1.ApiResponse.success(res, result, "Login exitoso");
        });
        this.refresh = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const { refreshToken } = req.body;
            const result = await auth_service_1.authService.refreshToken(refreshToken);
            response_1.ApiResponse.success(res, result, "Token refrescado");
        });
        this.me = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const user = await auth_service_1.authService.me(req.user.userId);
            response_1.ApiResponse.success(res, user);
        });
        this.register = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const { email, password, nombre, rol } = req.body;
            const result = await auth_service_1.authService.register(email, password, nombre, rol);
            response_1.ApiResponse.success(res, result, "Usuario registrado", 201);
        });
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map