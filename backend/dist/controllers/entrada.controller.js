"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entradaController = exports.EntradaController = void 0;
const entrada_service_1 = require("../services/entrada.service");
const response_1 = require("../utils/response");
const error_handler_1 = require("../middleware/error-handler");
class EntradaController {
    constructor() {
        this.findAll = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const socioId = req.query.socioId;
            const siloId = req.query.siloId;
            const result = await entrada_service_1.entradaService.findAll(page, limit, socioId, siloId);
            response_1.ApiResponse.paginated(res, result.entradas, page, limit, result.total);
        });
        this.findById = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const entrada = await entrada_service_1.entradaService.findById(req.params.id);
            response_1.ApiResponse.success(res, entrada);
        });
        this.create = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const entrada = await entrada_service_1.entradaService.create({
                ...req.body,
                usuarioId: req.user.userId,
            });
            response_1.ApiResponse.success(res, entrada, "Entrada registrada", 201);
        });
        this.update = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const entrada = await entrada_service_1.entradaService.update(req.params.id, req.body);
            response_1.ApiResponse.success(res, entrada, "Entrada actualizada");
        });
        this.delete = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            await entrada_service_1.entradaService.delete(req.params.id);
            response_1.ApiResponse.success(res, null, "Entrada eliminada", 204);
        });
    }
}
exports.EntradaController = EntradaController;
exports.entradaController = new EntradaController();
//# sourceMappingURL=entrada.controller.js.map