import { Router } from "express";
import { entradaController } from "../controllers/entrada.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createEntradaSchema, updateEntradaSchema, paginationSchema } from "../types/schemas";

const router = Router();

router.get("/", authenticate, validate(paginationSchema), entradaController.findAll);
router.get("/:id", authenticate, entradaController.findById);
router.post("/", authenticate, authorize("ADMIN", "EMPLEADO"), validate(createEntradaSchema), entradaController.create);
router.put("/:id", authenticate, authorize("ADMIN", "EMPLEADO"), validate(updateEntradaSchema), entradaController.update);
router.delete("/:id", authenticate, authorize("ADMIN", "EMPLEADO"), entradaController.delete);

export default router;