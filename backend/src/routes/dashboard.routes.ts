import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.get("/metricas", authenticate, authorize("ADMIN", "EMPLEADO"), dashboardController.getMetricas);
router.get("/silos", authenticate, dashboardController.getOcupacionSilos);
router.get("/cultivos", authenticate, authorize("ADMIN", "EMPLEADO"), dashboardController.getEntradasPorCultivo);
router.get("/top-socios", authenticate, authorize("ADMIN", "EMPLEADO"), dashboardController.getTopSocios);

export default router;