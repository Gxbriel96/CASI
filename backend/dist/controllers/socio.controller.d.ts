import { Request, Response, NextFunction } from "express";
export declare class SocioController {
    findAll: (req: Request, res: Response, next: NextFunction) => void;
    findById: (req: Request, res: Response, next: NextFunction) => void;
    create: (req: Request, res: Response, next: NextFunction) => void;
    update: (req: Request, res: Response, next: NextFunction) => void;
    delete: (req: Request, res: Response, next: NextFunction) => void;
    getParcelas: (req: Request, res: Response, next: NextFunction) => void;
    getEntradas: (req: Request, res: Response, next: NextFunction) => void;
    getLiquidaciones: (req: Request, res: Response, next: NextFunction) => void;
}
export declare const socioController: SocioController;
//# sourceMappingURL=socio.controller.d.ts.map