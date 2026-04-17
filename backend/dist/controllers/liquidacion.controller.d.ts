import { Request, Response, NextFunction } from "express";
export declare class LiquidacionController {
    findAll: (req: Request, res: Response, next: NextFunction) => void;
    findById: (req: Request, res: Response, next: NextFunction) => void;
    findBySocio: (req: Request, res: Response, next: NextFunction) => void;
    create: (req: Request, res: Response, next: NextFunction) => void;
    calcular: (req: Request, res: Response, next: NextFunction) => void;
    delete: (req: Request, res: Response, next: NextFunction) => void;
    getEstadisticas: (req: Request, res: Response, next: NextFunction) => void;
}
export declare const liquidacionController: LiquidacionController;
//# sourceMappingURL=liquidacion.controller.d.ts.map