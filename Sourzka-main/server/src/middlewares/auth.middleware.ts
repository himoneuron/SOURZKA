import { Request, Response, NextFunction } from "express";
import { VerifyJwt } from "../lib/utils";
import { ForbiddenError, UnauthorizedError } from "../lib/errors";

// Extend Request interface to include user object with `userId`
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

export function authorizeRoles(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

    if (!token) {
      throw new UnauthorizedError("Unauthorized: No token provided");
    }

    try {
      // Verify and decode the token
      const decoded = VerifyJwt(token);

      // Extract user info from the token
      const { userId, role, email } = decoded;

      if (!allowedRoles.includes(role)) {
        throw new ForbiddenError("Forbidden: Unauthorized access detected");
      }

      // Attach user info to the request object
      req.user = { userId, role, email };
    } catch (error) {
      throw new ForbiddenError("Forbidden: Unauthorized access detected");
    }
    if (!req.user) {
      throw new UnauthorizedError("Unauthorized: User not authenticated");
    }

    next();
  };
}
