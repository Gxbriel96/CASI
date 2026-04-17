"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socioController = exports.SocioController = void 0;
const socio_service_1 = require("../services/socio.service");
const response_1 = require("../utils/response");
const error_handler_1 = require("../middleware/error-handler");
class SocioController {
    constructor() {
        this.findAll = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const result = await socio_service_1.socioService.findAll(page, limit, search);
            response_1.ApiResponse.paginated(res, result.socios, page, limit, result.total);
        });
        this.findById = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const socio = await socio_service_1.socioService.findById(req.params.id);
            response_1.ApiResponse.success(res, socio);
        });
        this.create = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const socio = await socio_service_1.socioService.create(req.body);
            response_1.ApiResponse.success(res, socio, "Socio creado", 201);
        });
        this.update = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const socio = await socio_service_1.socioService.update(req.params.id, req.body);
            response_1.ApiResponse.success(res, socio, "Socio actualizado");
        });
        this.delete = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            await socio_service_1.socioService.delete(req.params.id);
            response_1.ApiResponse.success(res, null, "Socio eliminado", 204);
        });
        this.getParcelas = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const parcelas = await socio_service_1.socioService.getParcelas(req.params.id);
            response_1.ApiResponse.success(res, parcelas);
        });
        this.getEntradas = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await socio_service_1.socioService.getEntradas(req.params.id, page, limit);
            response_1.ApiResponse.paginated(res, result.entradas, page, limit, result.total);
        });
        this.getLiquidaciones = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await socio_service_1.socioService.getLiquidaciones(req.params.id, page, limit);
            response_1.ApiResponse.paginated(res, result.liquidaciones, page, limit, result.total);
        });
    }
}
exports.SocioController = SocioController;
exports.socioController = new SocioController();
//# sourceMappingURL=socio.controller.js.map