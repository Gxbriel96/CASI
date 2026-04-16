import { Router } from "express";
import authRoutes from "./auth.routes";
import sociosRoutes from "./socios.routes";
import parcelasRoutes from "./parcelas.routes";
import cosechasRoutes from "./cosechas.routes";
import entradasRoutes from "./entradas.routes";
import controlCalidadRoutes from "./control-calidad.routes";
import frutasRoutes from "./frutas.routes";
import silosRoutes from "./silos.routes";
import liquidacionesRoutes from "./liquidaciones.routes";
import dashboardRoutes from "./dashboard.routes";
import campanasRoutes from "./campanas.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/socios", sociosRoutes);
router.use("/parcelas", parcelasRoutes);
router.use("/cosechas", cosechasRoutes);
router.use("/entradas", entradasRoutes);
router.use("/control-calidad", controlCalidadRoutes);
router.use("/frutas", frutasRoutes);
router.use("/silos", silosRoutes);
router.use("/liquidaciones", liquidacionesRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/campanas", campanasRoutes);

router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;