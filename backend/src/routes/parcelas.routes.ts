import { Router } from "express";
import { parcelaController } from "../controllers/parcela.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createParcelaSchema, updateParcelaSchema } from "../types/schemas";

const router = Router();

router.get("/", authenticate, parcelaController.findAll);
router.get("/:id", authenticate, parcelaController.findById);
router.post("/", authenticate, authorize("ADMIN", "EMPLEADO"), validate(createParcelaSchema), parcelaController.create);
router.put("/:id", authenticate, authorize("ADMIN", "EMPLEADO"), validate(updateParcelaSchema), parcelaController.update);
router.delete("/:id", authenticate, authorize("ADMIN", "EMPLEADO"), parcelaController.delete);
router.get("/:id/trazabilidad", authenticate, parcelaController.getTrazabilidad);

export default router;