"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const silo_controller_1 = require("../controllers/silo.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const schemas_1 = require("../types/schemas");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, silo_controller_1.siloController.findAll);
router.get("/:id", auth_middleware_1.authenticate, silo_controller_1.siloController.findById);
router.get("/resumen/ocupacion", auth_middleware_1.authenticate, silo_controller_1.siloController.getResumenOcupacion);
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), (0, validate_middleware_1.validate)(schemas_1.createSiloSchema), silo_controller_1.siloController.create);
router.put("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), (0, validate_middleware_1.validate)(schemas_1.updateSiloSchema), silo_controller_1.siloController.update);
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN"), silo_controller_1.siloController.delete);
router.put("/:id/stock", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), silo_controller_1.siloController.updateStock);
exports.default = router;
//# sourceMappingURL=silos.routes.js.map