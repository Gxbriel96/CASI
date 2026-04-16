import { Router } from "express";
import { socioController } from "../controllers/socio.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createSocioSchema, updateSocioSchema, paginationSchema } from "../types/schemas";

const router = Router();

router.get("/", authenticate, authorize("ADMIN", "EMPLEADO"), validate(paginationSchema), socioController.findAll);
router.get("/:id", authenticate, socioController.findById);
router.post("/", authenticate, authorize("ADMIN", "EMPLEADO"), validate(createSocioSchema), socioController.create);
router.put("/:id", authenticate, authorize("ADMIN", "EMPLEADO"), validate(updateSocioSchema), socioController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), socioController.delete);
router.get("/:id/parcelas", authenticate, socioController.getParcelas);
router.get("/:id/entradas", authenticate, socioController.getEntradas);
router.get("/:id/liquidaciones", authenticate, socioController.getLiquidaciones);

export default router;