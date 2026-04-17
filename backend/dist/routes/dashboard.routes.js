"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/metricas", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), dashboard_controller_1.dashboardController.getMetricas);
router.get("/silos", auth_middleware_1.authenticate, dashboard_controller_1.dashboardController.getOcupacionSilos);
router.get("/cultivos", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), dashboard_controller_1.dashboardController.getEntradasPorCultivo);
router.get("/top-socios", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), dashboard_controller_1.dashboardController.getTopSocios);
exports.default = router;
//# sourceMappingURL=dashboard.routes.js.map