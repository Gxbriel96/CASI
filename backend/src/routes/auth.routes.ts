import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { loginSchema, registerSchema } from "../types/schemas";

const router = Router();

router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.get("/me", authenticate, authController.me);
router.post("/register", validate(registerSchema), authController.register);

export default router;