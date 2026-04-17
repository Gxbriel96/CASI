"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const socio_controller_1 = require("../controllers/socio.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const schemas_1 = require("../types/schemas");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), (0, validate_middleware_1.validate)(schemas_1.paginationSchema), socio_controller_1.socioController.findAll);
router.get("/:id", auth_middleware_1.authenticate, socio_controller_1.socioController.findById);
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), (0, validate_middleware_1.validate)(schemas_1.createSocioSchema), socio_controller_1.socioController.create);
router.put("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN", "EMPLEADO"), (0, validate_middleware_1.validate)(schemas_1.updateSocioSchema), socio_controller_1.socioController.update);
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN"), socio_controller_1.socioController.delete);
router.get("/:id/parcelas", auth_middleware_1.authenticate, socio_controller_1.socioController.getParcelas);
router.get("/:id/entradas", auth_middleware_1.authenticate, socio_controller_1.socioController.getEntradas);
router.get("/:id/liquidaciones", auth_middleware_1.authenticate, socio_controller_1.socioController.getLiquidaciones);
exports.default = router;
//# sourceMappingURL=socios.routes.js.map