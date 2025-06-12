// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { BaseError } from "../lib/BaseError";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof BaseError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  // Unhandled/unexpected error — log it for internal debugging
  console.error("[UNEXPECTED ERROR]", err);

  res.status(500).json({
    error: "Something went wrong",
  });
}
