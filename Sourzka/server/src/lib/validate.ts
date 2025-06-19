// lib/validate.ts
import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export function validate(schema: ZodSchema) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void | Promise<void> => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      res.status(422).json({ error: "Validation failed", details: err });
    }
  };
}
