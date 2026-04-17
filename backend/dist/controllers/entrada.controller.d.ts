import { Request, Response, NextFunction } from "express";
export declare class EntradaController {
    findAll: (req: Request, res: Response, next: NextFunction) => void;
    findById: (req: Request, res: Response, next: NextFunction) => void;
    create: (req: Request, res: Response, next: NextFunction) => void;
    update: (req: Request, res: Response, next: NextFunction) => void;
    delete: (req: Request, res: Response, next: NextFunction) => void;
}
export declare const entradaController: EntradaController;
//# sourceMappingURL=entrada.controller.d.ts.map