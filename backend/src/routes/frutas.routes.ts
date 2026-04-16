import { Router } from "express";
import { frutaController } from "../controllers/fruta.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createFrutaSchema, paginationSchema } from "../types/schemas";

const router = Router();

router.get("/", authenticate, validate(paginationSchema), frutaController.findAll);
router.get("/:id", authenticate, frutaController.findById);
router.post("/", authenticate, authorize("ADMIN", "EMPLEADO"), validate(createFrutaSchema), frutaController.create);
router.delete("/:id", authenticate, authorize("ADMIN", "EMPLEADO"), frutaController.delete);
router.get("/estadisticas", authenticate, frutaController.getEstadisticas);

export default router;