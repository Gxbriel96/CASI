"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cosechaController = exports.CosechaController = void 0;
const cosecha_service_1 = require("../services/cosecha.service");
const response_1 = require("../utils/response");
const error_handler_1 = require("../middleware/error-handler");
class CosechaController {
    constructor() {
        this.findAll = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const parcelaId = req.query.parcelaId;
            const cosechas = await cosecha_service_1.cosechaService.findAll(parcelaId);
            response_1.ApiResponse.success(res, cosechas);
        });
        this.findById = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const cosecha = await cosecha_service_1.cosechaService.findById(req.params.id);
            response_1.ApiResponse.success(res, cosecha);
        });
        this.create = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const data = {
                ...req.body,
                fechaSiembra: req.body.fechaSiembra ? new Date(req.body.fechaSiembra) : undefined,
                fechaCosecha: req.body.fechaCosecha ? new Date(req.body.fechaCosecha) : undefined,
            };
            const cosecha = await cosecha_service_1.cosechaService.create(data);
            response_1.ApiResponse.success(res, cosecha, "Cosecha creada", 201);
        });
        this.update = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const data = {
                ...req.body,
                fechaSiembra: req.body.fechaSiembra ? new Date(req.body.fechaSiembra) : undefined,
                fechaCosecha: req.body.fechaCosecha ? new Date(req.body.fechaCosecha) : undefined,
            };
            const cosecha = await cosecha_service_1.cosechaService.update(req.params.id, data);
            response_1.ApiResponse.success(res, cosecha, "Cosecha actualizada");
        });
        this.delete = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            await cosecha_service_1.cosechaService.delete(req.params.id);
            response_1.ApiResponse.success(res, null, "Cosecha eliminada", 204);
        });
    }
}
exports.CosechaController = CosechaController;
exports.cosechaController = new CosechaController();
//# sourceMappingURL=cosecha.controller.js.map