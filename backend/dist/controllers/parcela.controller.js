"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parcelaController = exports.ParcelaController = void 0;
const parcela_service_1 = require("../services/parcela.service");
const response_1 = require("../utils/response");
const error_handler_1 = require("../middleware/error-handler");
class ParcelaController {
    constructor() {
        this.findAll = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const socioId = req.query.socioId;
            const parcelas = await parcela_service_1.parcelaService.findAll(socioId);
            response_1.ApiResponse.success(res, parcelas);
        });
        this.findById = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const parcela = await parcela_service_1.parcelaService.findById(req.params.id);
            response_1.ApiResponse.success(res, parcela);
        });
        this.create = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const parcela = await parcela_service_1.parcelaService.create(req.body);
            response_1.ApiResponse.success(res, parcela, "Parcela creada", 201);
        });
        this.update = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const parcela = await parcela_service_1.parcelaService.update(req.params.id, req.body);
            response_1.ApiResponse.success(res, parcela, "Parcela actualizada");
        });
        this.delete = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            await parcela_service_1.parcelaService.delete(req.params.id);
            response_1.ApiResponse.success(res, null, "Parcela eliminada", 204);
        });
        this.getTrazabilidad = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const trazabilidad = await parcela_service_1.parcelaService.getTrazabilidad(req.params.id);
            response_1.ApiResponse.success(res, trazabilidad);
        });
    }
}
exports.ParcelaController = ParcelaController;
exports.parcelaController = new ParcelaController();
//# sourceMappingURL=parcela.controller.js.map