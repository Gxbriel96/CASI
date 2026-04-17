"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fruta_controller_1 = require("../controllers/fruta.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const schemas_1 = require("../types/schemas");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, (0, validate_middleware_1.validate)(schemas_1.paginationSchema), fruta_controller_1.frutaController.findAll);
router.get("/:id", auth_middleware_1.authenticate, fruta_controller_1.frutaController.findById);
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), (0, validate_middleware_1.validate)(schemas_1.createFrutaSchema), fruta_controller_1.frutaController.create);
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), fruta_controller_1.frutaController.delete);
router.get("/estadisticas", auth_middleware_1.authenticate, fruta_controller_1.frutaController.getEstadisticas);
exports.default = router;
//# sourceMappingURL=frutas.routes.js.map