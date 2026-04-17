"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campanaController = exports.CampanaController = void 0;
const campana_service_1 = require("../services/campana.service");
const response_1 = require("../utils/response");
const error_handler_1 = require("../middleware/error-handler");
class CampanaController {
    constructor() {
        this.findAll = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const campanas = await campana_service_1.campanaService.findAll();
            response_1.ApiResponse.success(res, campanas);
        });
        this.findActive = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const campana = await campana_service_1.campanaService.findActive();
            response_1.ApiResponse.success(res, campana);
        });
        this.findById = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const campana = await campana_service_1.campanaService.findById(req.params.id);
            response_1.ApiResponse.success(res, campana);
        });
        this.create = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const data = {
                ...req.body,
                fechaInicio: new Date(req.body.fechaInicio),
                fechaFin: new Date(req.body.fechaFin),
            };
            const campana = await campana_service_1.campanaService.create(data);
            response_1.ApiResponse.success(res, campana, "Campaña creada", 201);
        });
        this.update = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const data = {
                ...req.body,
                ...(req.body.fechaInicio && { fechaInicio: new Date(req.body.fechaInicio) }),
                ...(req.body.fechaFin && { fechaFin: new Date(req.body.fechaFin) }),
            };
            const campana = await campana_service_1.campanaService.update(req.params.id, data);
            response_1.ApiResponse.success(res, campana, "Campaña actualizada");
        });
        this.delete = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            await campana_service_1.campanaService.delete(req.params.id);
            response_1.ApiResponse.success(res, null, "Campaña eliminada", 204);
        });
    }
}
exports.CampanaController = CampanaController;
exports.campanaController = new CampanaController();
//# sourceMappingURL=campana.controller.js.map