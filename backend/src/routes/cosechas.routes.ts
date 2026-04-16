import { Router } from "express";
import { cosechaController } from "../controllers/cosecha.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createCosechaSchema } from "../types/schemas";

const router = Router();

router.get("/", authenticate, cosechaController.findAll);
router.get("/:id", authenticate, cosechaController.findById);
router.post("/", authenticate, authorize("ADMIN", "EMPLEADO"), validate(createCosechaSchema), cosechaController.create);
router.put("/:id", authenticate, authorize("ADMIN", "EMPLEADO"), cosechaController.update);
router.delete("/:id", authenticate, authorize("ADMIN", "EMPLEADO"), cosechaController.delete);

export default router;