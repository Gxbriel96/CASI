import { Router } from "express";
import { controlCalidadController } from "../controllers/control-calidad.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createControlCalidadSchema, updateControlCalidadSchema, paginationSchema } from "../types/schemas";

const router = Router();

router.get("/", authenticate, validate(paginationSchema), controlCalidadController.findAll);
router.get("/:id", authenticate, controlCalidadController.findById);
router.post("/", authenticate, authorize("ADMIN", "EMPLEADO"), validate(createControlCalidadSchema), controlCalidadController.create);
router.put("/:id/resultado", authenticate, authorize("ADMIN", "EMPLEADO"), validate(updateControlCalidadSchema), controlCalidadController.updateResultado);

export default router;