import { Router } from "express";
import { siloController } from "../controllers/silo.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createSiloSchema, updateSiloSchema } from "../types/schemas";

const router = Router();

router.get("/", authenticate, siloController.findAll);
router.get("/:id", authenticate, siloController.findById);
router.get("/resumen/ocupacion", authenticate, siloController.getResumenOcupacion);
router.post("/", authenticate, authorize("ADMIN", "EMPLEADO"), validate(createSiloSchema), siloController.create);
router.put("/:id", authenticate, authorize("ADMIN", "EMPLEADO"), validate(updateSiloSchema), siloController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), siloController.delete);
router.put("/:id/stock", authenticate, authorize("ADMIN", "EMPLEADO"), siloController.updateStock);

export default router;