"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siloController = exports.SiloController = void 0;
const silo_service_1 = require("../services/silo.service");
const response_1 = require("../utils/response");
const error_handler_1 = require("../middleware/error-handler");
class SiloController {
    constructor() {
        this.findAll = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const silos = await silo_service_1.siloService.findAll();
            response_1.ApiResponse.success(res, silos);
        });
        this.findById = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const silo = await silo_service_1.siloService.findById(req.params.id);
            response_1.ApiResponse.success(res, silo);
        });
        this.create = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const silo = await silo_service_1.siloService.create(req.body);
            response_1.ApiResponse.success(res, silo, "Silo creado", 201);
        });
        this.update = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const silo = await silo_service_1.siloService.update(req.params.id, req.body);
            response_1.ApiResponse.success(res, silo, "Silo actualizado");
        });
        this.delete = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            await silo_service_1.siloService.delete(req.params.id);
            response_1.ApiResponse.success(res, null, "Silo eliminado", 204);
        });
        this.updateStock = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const { cantidad, operacion } = req.body;
            const silo = await silo_service_1.siloService.updateStock(req.params.id, cantidad, operacion);
            response_1.ApiResponse.success(res, silo, "Stock actualizado");
        });
        this.getResumenOcupacion = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const resumen = await silo_service_1.siloService.getResumenOcupacion();
            response_1.ApiResponse.success(res, resumen);
        });
    }
}
exports.SiloController = SiloController;
exports.siloController = new SiloController();
//# sourceMappingURL=silo.controller.js.map