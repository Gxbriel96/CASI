import { Router } from "express";
import { liquidacionController } from "../controllers/liquidacion.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createLiquidacionSchema, calcularLiquidacionSchema, paginationSchema } from "../types/schemas";

const router = Router();

router.get("/", authenticate, validate(paginationSchema), liquidacionController.findAll);
router.get("/socio/:id", authenticate, liquidacionController.findBySocio);
router.get("/:id", authenticate, liquidacionController.findById);
router.get("/estadisticas", authenticate, liquidacionController.getEstadisticas);
router.post("/", authenticate, authorize("ADMIN", "EMPLEADO"), validate(createLiquidacionSchema), liquidacionController.create);
router.post("/calcular", authenticate, validate(calcularLiquidacionSchema), liquidacionController.calcular);
router.delete("/:id", authenticate, authorize("ADMIN"), liquidacionController.delete);

export default router;