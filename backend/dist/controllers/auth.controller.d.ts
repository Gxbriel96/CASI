import { Request, Response, NextFunction } from "express";
export declare class AuthController {
    login: (req: Request, res: Response, next: NextFunction) => void;
    refresh: (req: Request, res: Response, next: NextFunction) => void;
    me: (req: Request, res: Response, next: NextFunction) => void;
    register: (req: Request, res: Response, next: NextFunction) => void;
}
export declare const authController: AuthController;
//# sourceMappingURL=auth.controller.d.ts.map