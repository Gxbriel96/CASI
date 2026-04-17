"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = exports.DashboardController = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
const response_1 = require("../utils/response");
const error_handler_1 = require("../middleware/error-handler");
class DashboardController {
    constructor() {
        this.getMetricas = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const metricas = await dashboard_service_1.dashboardService.getMetricas();
            response_1.ApiResponse.success(res, metricas);
        });
        this.getOcupacionSilos = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const ocupacion = await dashboard_service_1.dashboardService.getOcupacionSilos();
            response_1.ApiResponse.success(res, ocupacion);
        });
        this.getEntradasPorCultivo = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const entradas = await dashboard_service_1.dashboardService.getEntradasPorCultivo();
            response_1.ApiResponse.success(res, entradas);
        });
        this.getTopSocios = (0, error_handler_1.asyncHandler)(async (req, res, next) => {
            const limit = parseInt(req.query.limit) || 10;
            const top = await dashboard_service_1.dashboardService.getTopSocios(limit);
            response_1.ApiResponse.success(res, top);
        });
    }
}
exports.DashboardController = DashboardController;
exports.dashboardController = new DashboardController();
//# sourceMappingURL=dashboard.controller.js.map