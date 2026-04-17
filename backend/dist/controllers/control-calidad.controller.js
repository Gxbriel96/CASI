"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlCalidadController = exports.ControlCalidadController = void 0;
const control_calidad_service_1 = require("../services/control-calidad.service");
const response_1 = require("../utils/response");
const error_handler_1 = require("../middleware/error-handler");
class ControlCalidadController {
    constructor() {
        this.findAll = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const resultado = req.query.resultado;
            const result = await control_calidad_service_1.controlCalidadService.findAll(page, limit, resultado);
            response_1.ApiResponse.paginated(res, result.controles, page, limit, result.total);
        });
        this.findById = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const control = await control_calidad_service_1.controlCalidadService.findById(req.params.id);
            response_1.ApiResponse.success(res, control);
        });
        this.create = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const control = await control_calidad_service_1.controlCalidadService.create(req.body);
            response_1.ApiResponse.success(res, control, "Control de calidad registrado", 201);
        });
        this.updateResultado = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const { resultado, observaciones } = req.body;
            const control = await control_calidad_service_1.controlCalidadService.updateResultado(req.params.id, resultado, observaciones);
            response_1.ApiResponse.success(res, control, "Resultado actualizado");
        });
    }
}
exports.ControlCalidadController = ControlCalidadController;
exports.controlCalidadController = new ControlCalidadController();
//# sourceMappingURL=control-calidad.controller.js.map