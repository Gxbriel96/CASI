import { Request, Response, NextFunction } from "express";
export declare class FrutaController {
    findAll: (req: Request, res: Response, next: NextFunction) => void;
    findById: (req: Request, res: Response, next: NextFunction) => void;
    create: (req: Request, res: Response, next: NextFunction) => void;
    delete: (req: Request, res: Response, next: NextFunction) => void;
    getEstadisticas: (req: Request, res: Response, next: NextFunction) => void;
}
export declare const frutaController: FrutaController;
//# sourceMappingURL=fruta.controller.d.ts.map