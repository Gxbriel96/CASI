import { Request, Response, NextFunction } from "express";
export declare class SiloController {
    findAll: (req: Request, res: Response, next: NextFunction) => void;
    findById: (req: Request, res: Response, next: NextFunction) => void;
    create: (req: Request, res: Response, next: NextFunction) => void;
    update: (req: Request, res: Response, next: NextFunction) => void;
    delete: (req: Request, res: Response, next: NextFunction) => void;
    updateStock: (req: Request, res: Response, next: NextFunction) => void;
    getResumenOcupacion: (req: Request, res: Response, next: NextFunction) => void;
}
export declare const siloController: SiloController;
//# sourceMappingURL=silo.controller.d.ts.map