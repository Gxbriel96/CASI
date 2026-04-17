export declare class AppError extends Error {
    message: string;
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number, isOperational?: boolean);
}
export declare class ValidationError extends AppError {
    errors?: {
        field: string;
        message: string;
    }[] | undefined;
    constructor(message: string, errors?: {
        field: string;
        message: string;
    }[] | undefined);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
export declare class ConflictError extends AppError {
    constructor(message: string);
}
//# sourceMappingURL=errors.d.ts.map