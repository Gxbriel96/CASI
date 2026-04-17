"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.frutaController = exports.FrutaController = void 0;
const fruta_service_1 = require("../services/fruta.service");
const response_1 = require("../utils/response");
const error_handler_1 = require("../middleware/error-handler");
class FrutaController {
    constructor() {
        this.findAll = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const socioId = req.query.socioId;
            const especie = req.query.especie;
            const result = await fruta_service_1.frutaService.findAll(page, limit, socioId, especie);
            response_1.ApiResponse.paginated(res, result.frutas, page, limit, result.total);
        });
        this.findById = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const fruta = await fruta_service_1.frutaService.findById(req.params.id);
            response_1.ApiResponse.success(res, fruta);
        });
        this.create = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const fruta = await fruta_service_1.frutaService.create({
                ...req.body,
                usuarioId: req.user.userId,
            });
            response_1.ApiResponse.success(res, fruta, "Control de fruta registrado", 201);
        });
        this.delete = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            await fruta_service_1.frutaService.delete(req.params.id);
            response_1.ApiResponse.success(res, null, "Control de fruta eliminado", 204);
        });
        this.getEstadisticas = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const socioId = req.query.socioId;
            const stats = await fruta_service_1.frutaService.getEstadisticas(socioId);
            response_1.ApiResponse.success(res, stats);
        });
    }
}
exports.FrutaController = FrutaController;
exports.frutaController = new FrutaController();
//# sourceMappingURL=fruta.controller.js.map