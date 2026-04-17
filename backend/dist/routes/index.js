"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const socios_routes_1 = __importDefault(require("./socios.routes"));
const parcelas_routes_1 = __importDefault(require("./parcelas.routes"));
const cosechas_routes_1 = __importDefault(require("./cosechas.routes"));
const entradas_routes_1 = __importDefault(require("./entradas.routes"));
const control_calidad_routes_1 = __importDefault(require("./control-calidad.routes"));
const frutas_routes_1 = __importDefault(require("./frutas.routes"));
const silos_routes_1 = __importDefault(require("./silos.routes"));
const liquidaciones_routes_1 = __importDefault(require("./liquidaciones.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const campanas_routes_1 = __importDefault(require("./campanas.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/socios", socios_routes_1.default);
router.use("/parcelas", parcelas_routes_1.default);
router.use("/cosechas", cosechas_routes_1.default);
router.use("/entradas", entradas_routes_1.default);
router.use("/control-calidad", control_calidad_routes_1.default);
router.use("/frutas", frutas_routes_1.default);
router.use("/silos", silos_routes_1.default);
router.use("/liquidaciones", liquidaciones_routes_1.default);
router.use("/dashboard", dashboard_routes_1.default);
router.use("/campanas", campanas_routes_1.default);
router.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
exports.default = router;
//# sourceMappingURL=index.js.map