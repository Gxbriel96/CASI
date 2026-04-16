import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(err instanceof AppError && err.statusCode === 400 && "errors" in err && { errors: (err as unknown as { errors: unknown }).errors }),
    });
  }

  console.error("Unexpected error:", err);

  const message = process.env.NODE_ENV === "production" ? "Internal server error" : err.message;

  res.status(500).json({
    status: "error",
    message,
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};