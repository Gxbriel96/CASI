"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const control_calidad_controller_1 = require("../controllers/control-calidad.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const schemas_1 = require("../types/schemas");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(schemas_1.paginationSchema), control_calidad_controller_1.controlCalidadController.findAll);
router.get("/:id", auth_middleware_1.authenticate, control_calidad_controller_1.controlCalidadController.findById);
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), (0, validate_middleware_1.validate)(schemas_1.createControlCalidadSchema), control_calidad_controller_1.controlCalidadController.create);
router.put("/:id/resultado", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), (0, validate_middleware_1.validate)(schemas_1.updateControlCalidadSchema), control_calidad_controller_1.controlCalidadController.updateResultado);
exports.default = router;
//# sourceMappingURL=control-calidad.routes.js.map