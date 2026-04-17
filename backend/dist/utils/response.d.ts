import { Response } from "express";
export declare class ApiResponse {
    static success<T>(res: Response, data: T, message?: string, statusCode?: number): Response<any, Record<string, any>>;
    static error(res: Response, message: string, statusCode?: number, errors?: Record<string, unknown>): Response<any, Record<string, any>>;
    static paginated<T>(res: Response, data: T[], page: number, limit: number, total: number): Response<any, Record<string, any>>;
}
//# sourceMappingURL=response.d.ts.map