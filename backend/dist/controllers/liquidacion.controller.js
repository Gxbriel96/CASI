"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liquidacionController = exports.LiquidacionController = void 0;
const liquidacion_service_1 = require("../services/liquidacion.service");
const response_1 = require("../utils/response");
const error_handler_1 = require("../middleware/error-handler");
class LiquidacionController {
    constructor() {
        this.findAll = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const socioId = req.query.socioId;
            const result = await liquidacion_service_1.liquidacionService.findAll(page, limit, socioId);
            response_1.ApiResponse.paginated(res, result.liquidaciones, page, limit, result.total);
        });
        this.findById = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const liquidacion = await liquidacion_service_1.liquidacionService.findById(req.params.id);
            response_1.ApiResponse.success(res, liquidacion);
        });
        this.findBySocio = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await liquidacion_service_1.liquidacionService.findBySocio(req.params.id, page, limit);
            response_1.ApiResponse.paginated(res, result.liquidaciones, page, limit, result.total);
        });
        this.create = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const liquidacion = await liquidacion_service_1.liquidacionService.create(req.body);
            response_1.ApiResponse.success(res, liquidacion, "Liquidación creada", 201);
        });
        this.calcular = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const { socioId, cosechaId } = req.body;
            const calculo = await liquidacion_service_1.liquidacionService.calcular(socioId, cosechaId);
            response_1.ApiResponse.success(res, calculo);
        });
        this.delete = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            await liquidacion_service_1.liquidacionService.delete(req.params.id);
            response_1.ApiResponse.success(res, null, "Liquidación eliminada", 204);
        });
        this.getEstadisticas = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const stats = await liquidacion_service_1.liquidacionService.getEstadisticas();
            response_1.ApiResponse.success(res, stats);
        });
    }
}
exports.LiquidacionController = LiquidacionController;
exports.liquidacionController = new LiquidacionController();
//# sourceMappingURL=liquidacion.controller.js.map