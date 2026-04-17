"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const entrada_controller_1 = require("../controllers/entrada.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const schemas_1 = require("../types/schemas");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(schemas_1.paginationSchema), entrada_controller_1.entradaController.findAll);
router.get("/:id", auth_middleware_1.authenticate, entrada_controller_1.entradaController.findById);
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), (0, validate_middleware_1.validate)(schemas_1.createEntradaSchema), entrada_controller_1.entradaController.create);
router.put("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), (0, validate_middleware_1.validate)(schemas_1.updateEntradaSchema), entrada_controller_1.entradaController.update);
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), entrada_controller_1.entradaController.delete);
exports.default = router;
//# sourceMappingURL=entradas.routes.js.map