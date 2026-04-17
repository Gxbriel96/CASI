import { Request, Response, NextFunction } from "express";
export declare class DashboardController {
    getMetricas: (req: Request, res: Response, next: NextFunction) => void;
    getOcupacionSilos: (req: Request, res: Response, next: NextFunction) => void;
    getEntradasPorCultivo: (req: Request, res: Response, next: NextFunction) => void;
    getTopSocios: (req: Request, res: Response, next: NextFunction) => void;
}
export declare const dashboardController: DashboardController;
//# sourceMappingURL=dashboard.controller.d.ts.map