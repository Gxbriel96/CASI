"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const liquidacion_controller_1 = require("../controllers/liquidacion.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const schemas_1 = require("../types/schemas");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(schemas_1.paginationSchema), liquidacion_controller_1.liquidacionController.findAll);
router.get("/socio/:id", auth_middleware_1.authenticate, liquidacion_controller_1.liquidacionController.findBySocio);
router.get("/:id", auth_middleware_1.authenticate, liquidacion_controller_1.liquidacionController.findById);
router.get("/estadisticas", auth_middleware_1.authenticate, liquidacion_controller_1.liquidacionController.getEstadisticas);
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), (0, validate_middleware_1.validate)(schemas_1.createLiquidacionSchema), liquidacion_controller_1.liquidacionController.create);
router.post("/calcular", auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(schemas_1.calcularLiquidacionSchema), liquidacion_controller_1.liquidacionController.calcular);
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN"), liquidacion_controller_1.liquidacionController.delete);
exports.default = router;
//# sourceMappingURL=liquidaciones.routes.js.map