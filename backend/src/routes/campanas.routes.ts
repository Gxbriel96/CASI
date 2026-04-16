import { Router } from "express";
import { campanaController } from "../controllers/campana.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createCampanaSchema } from "../types/schemas";

const router = Router();

router.get("/", authenticate, campanaController.findAll);
router.get("/activa", authenticate, campanaController.findActive);
router.get("/:id", authenticate, campanaController.findById);
router.post("/", authenticate, authorize("ADMIN"), validate(createCampanaSchema), campanaController.create);
router.put("/:id", authenticate, authorize("ADMIN"), campanaController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), campanaController.delete);

export default router;