"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const schemas_1 = require("../types/schemas");
const router = (0, express_1.Router)();
router.post("/login", (0, validate_middleware_1.validate)(schemas_1.loginSchema), auth_controller_1.authController.login);
router.post("/refresh", auth_controller_1.authController.refresh);
router.get("/me", auth_middleware_1.authenticate, auth_controller_1.authController.me);
router.post("/register", (0, validate_middleware_1.validate)(schemas_1.registerSchema), auth_controller_1.authController.register);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map