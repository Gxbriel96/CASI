"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cosecha_controller_1 = require("../controllers/cosecha.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const schemas_1 = require("../types/schemas");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, cosecha_controller_1.cosechaController.findAll);
router.get("/:id", auth_middleware_1.authenticate, cosecha_controller_1.cosechaController.findById);
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), (0, validate_middleware_1.validate)(schemas_1.createCosechaSchema), cosecha_controller_1.cosechaController.create);
router.put("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), cosecha_controller_1.cosechaController.update);
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), cosecha_controller_1.cosechaController.delete);
exports.default = router;
//# sourceMappingURL=cosechas.routes.js.map