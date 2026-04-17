"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const campana_controller_1 = require("../controllers/campana.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const schemas_1 = require("../types/schemas");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, campana_controller_1.campanaController.findAll);
router.get("/activa", auth_middleware_1.authenticate, campana_controller_1.campanaController.findActive);
router.get("/:id", auth_middleware_1.authenticate, campana_controller_1.campanaController.findById);
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN"), (0, validate_middleware_1.validate)(schemas_1.createCampanaSchema), campana_controller_1.campanaController.create);
router.put("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN"), campana_controller_1.campanaController.update);
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)("ADMIN"), campana_controller_1.campanaController.delete);
exports.default = router;
//# sourceMappingURL=campanas.routes.js.map