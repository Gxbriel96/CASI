import { Request, Response, NextFunction } from "express";
export declare class ParcelaController {
    findAll: (req: Request, res: Response, next: NextFunction) => void;
    findById: (req: Request, res: Response, next: NextFunction) => void;
    create: (req: Request, res: Response, next: NextFunction) => void;
    update: (req: Request, res: Response, next: NextFunction) => void;
    delete: (req: Request, res: Response, next: NextFunction) => void;
    getTrazabilidad: (req: Request, res: Response, next: NextFunction) => void;
}
export declare const parcelaController: ParcelaController;
//# sourceMappingURL=parcela.controller.d.ts.map