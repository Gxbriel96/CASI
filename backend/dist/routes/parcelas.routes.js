"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parcela_controller_1 = require("../controllers/parcela.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const schemas_1 = require("../types/schemas");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, parcela_controller_1.parcelaController.findAll);
router.get("/:id", auth_middleware_1.authenticate, parcela_controller_1.parcelaController.findById);
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), (0, validate_middleware_1.validate)(schemas_1.createParcelaSchema), parcela_controller_1.parcelaController.create);
router.put("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), (0, validate_middleware_1.validate)(schemas_1.updateParcelaSchema), parcela_controller_1.parcelaController.update);
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), parcela_controller_1.parcelaController.delete);
router.get("/:id/trazabilidad", auth_middleware_1.authenticate, parcela_controller_1.parcelaController.getTrazabilidad);
exports.default = router;
//# sourceMappingURL=parcelas.routes.js.map